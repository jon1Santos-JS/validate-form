import { compareSync, genSaltSync, hashSync } from 'bcrypt-ts';

export function createHash<T>(value: T) {
    const salt = genSaltSync(10);
    const stringifiedValue = JSON.stringify(value);
    const hash = hashSync(stringifiedValue, salt);
    return hash;
}

export async function ReturnUserByHash(
    browserHash: string | undefined,
    users: UserFromClientType[],
) {
    const validation = { isValid: false, user: {} };
    if (!browserHash) {
        console.log('invalid hash');
        return false;
    }
    if (users.length === 1) {
        if (compareSync(JSON.stringify(users[0]), browserHash)) {
            return (validation.user = users[0]);
        }
        return false;
    }
    users.forEach((user) => {
        const stringifiedUser = JSON.stringify(user);
        if (compareSync(stringifiedUser, browserHash)) {
            validation.user = user;
        }
    });

    return validation.user as UserFromClientType;
}
