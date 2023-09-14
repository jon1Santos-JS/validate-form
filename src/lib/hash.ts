import { compareSync, genSaltSync, hashSync } from 'bcrypt-ts';
import { onOmitProps } from './lodashAdapter';

const OMIT_INPUTS_FIELDS_TO_COMPARE: ['ID', 'constraint', 'userImage'] = [
    'ID',
    'constraint',
    'userImage',
];

export const USER_HASH_NAME = 'user-hash';

const HASH_DEFAULT_ERROR = 'invalid hash';
const USER_HASH_ERROR = 'User was not found by hash';

export function createHash<T>(value: T) {
    const salt = genSaltSync(10);
    const stringifiedValue = JSON.stringify(value);
    const hash = hashSync(stringifiedValue, salt);
    return hash;
}

export async function returnUserByHash(
    browserHash: string | undefined,
    users: UserFromDataBaseType[],
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
        message: USER_HASH_ERROR,
    };

    if (users.length > 1) {
        users.forEach((user) => {
            const userToCompare = onOmitProps(
                user,
                OMIT_INPUTS_FIELDS_TO_COMPARE,
            );
            if (compareSync(JSON.stringify(userToCompare), browserHash)) {
                validation.user = {
                    username: user.username.value,
                    userImage: user.userImage,
                };
                validation.isValid = true;
            }
        });
    } else {
        // IF THERE'S NO DATABASE USERS, IT IS COMPARING ADMIN'S ACCOUNT TO HASH
        const uniqueUser = users[0];
        const userToCompare = onOmitProps(
            uniqueUser,
            OMIT_INPUTS_FIELDS_TO_COMPARE,
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
