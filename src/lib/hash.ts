import { compareSync, genSaltSync, hashSync } from 'bcrypt-ts';

// Hash time stamp

const HOUR = 1000 * 60 * 60;
export const COOKIES_EXPIRES = new Date(Date.now() + HOUR * 2);

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

    users.forEach((user) => {
        const userToCompare = {
            username: user.username,
            password: user.password,
        };
        if (compareSync(JSON.stringify(userToCompare), browserHash)) {
            validation.user = {
                username: user.username.value,
                userImage: user.userImage,
            };
            validation.isValid = true;
        }
    });

    const conditional = validation.isValid
        ? validation.user
        : validation.message;
    return {
        serverResponse: validation.isValid,
        body: conditional,
    };
}
