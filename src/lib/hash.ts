import { compareSync, genSaltSync, hashSync } from 'bcrypt-ts';
import { getUserStateController } from './controllers';
import { Lodash } from './lodashAdapter';

export const HASH_DEFAULT_ERROR = 'invalid hash';

const INPUTS_FIELDS_TO_OMIT = ['ID', 'constraint', 'userImage'];

export function createHash<T>(value: T) {
    const salt = genSaltSync(10);
    const stringifiedValue = JSON.stringify(value);
    const hash = hashSync(stringifiedValue, salt);
    return hash;
}

export async function returnUserByHash(
    browserHash: string | undefined,
): Promise<{
    serverResponse: boolean;
    body: string | UserType;
}> {
    if (!browserHash) {
        return {
            serverResponse: false,
            body: HASH_DEFAULT_ERROR,
        };
    }
    const validation = {
        isValid: false,
        user: { username: '' } as UserType,
        message: 'User was not found',
    };
    const controllerResponse = await getUserStateController();
    if (typeof controllerResponse.body === 'string')
        return {
            serverResponse: validation.isValid,
            body: controllerResponse.body,
        };
    const usersFromDB = controllerResponse.body;
    if (usersFromDB.length > 1) {
        usersFromDB.forEach((user) => {
            const userToCompare = Lodash.onOmitFields(
                user,
                INPUTS_FIELDS_TO_OMIT,
            );
            if (compareSync(JSON.stringify(userToCompare), browserHash)) {
                const userToClient = {
                    username: user.username.value,
                    userImage: user.userImage,
                };
                validation.user = userToClient;
                validation.isValid = true;
            }
        });
    } else {
        // IF THERE'S NO DATABASE USERS, IT IS COMPARING ADMIN'S ACCOUNT TO HASH
        const uniqueUser = controllerResponse.body[0];
        const userToCompare = Lodash.onOmitFields(
            uniqueUser,
            INPUTS_FIELDS_TO_OMIT,
        );
        if (compareSync(JSON.stringify(userToCompare), browserHash)) {
            validation.user = {
                username: uniqueUser.username.value,
                userImage: uniqueUser.userImage,
            };
            validation.isValid = true;
        }
    }

    const conditional = validation.isValid
        ? validation.user
        : validation.message;
    return {
        serverResponse: validation.isValid,
        body: conditional,
    };
}
