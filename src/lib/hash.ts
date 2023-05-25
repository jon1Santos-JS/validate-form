import { compareSync, genSaltSync, hashSync } from 'bcrypt-ts';

const HASH_ERROR_RESPONSE = 'invalid hash';

export function createHash<T>(value: T) {
    const salt = genSaltSync(10);
    const stringifiedValue = JSON.stringify(value);
    const hash = hashSync(stringifiedValue, salt);
    return hash;
}

export async function onValidateHash(
    browserHash: string | undefined,
    users: UserFromClientType[],
) {
    if (!browserHash) return HASH_ERROR_RESPONSE;
    const validation = { isValid: false };

    users.forEach((user) => {
        const stringifiedUser = JSON.stringify(user);
        if (compareSync(stringifiedUser, browserHash)) {
            validation.isValid = true;
        }
    });
    return validation.isValid;
}
