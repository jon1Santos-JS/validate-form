import { hashSync, genSaltSync, compareSync } from 'bcrypt-ts';

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
    users: UserFromDataBase[],
) {
    const response = {
        success: false,
        data: HASH_DEFAULT_ERROR,
    } as HashResponse;
    if (!browserHash) {
        return response;
    }
    users.forEach((user) => {
        const userToCompare = {
            username: user.username,
            password: user.password,
        };
        if (compareSync(JSON.stringify(userToCompare), browserHash)) {
            response.success = true;
            response.data = user;
        }
    });
    if (!response.success) return { ...response, data: USER_HASH_ERROR };
    return response;
}
