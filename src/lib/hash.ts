import { compareSync, genSaltSync, hashSync } from 'bcrypt-ts';
import { getUserStateController } from './controllers';
import { onOmitDBInputFields } from './inputHandler';
import { ADMINS_ACCOUNT } from '@/database/miniDB';

export const HASH_DEFAULT_ERROR = 'invalid hash';

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
    body: string;
}> {
    if (!browserHash) {
        return {
            serverResponse: false,
            body: HASH_DEFAULT_ERROR,
        };
    }
    const validation = {
        isValid: false,
        user: '',
        message: 'User was not found',
    };
    const controllerResponse = await getUserStateController();
    // NO DATABASE
    if (typeof controllerResponse.body === 'string')
        return {
            serverResponse: validation.isValid,
            body: controllerResponse.body,
        };
    // DATABASE
    const usersFromDB = controllerResponse.body;
    const handledUsers = onOmitDBInputFields(usersFromDB);
    if (handledUsers.length > 1) {
        handledUsers.forEach((user) => {
            if (compareSync(JSON.stringify(user), browserHash)) {
                validation.user = user.username.value;
                validation.isValid = true;
            }
        });
    } else {
        if (compareSync(JSON.stringify(ADMINS_ACCOUNT), browserHash)) {
            validation.user = ADMINS_ACCOUNT.username.value;
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
