import { compareSync, genSaltSync, hashSync } from 'bcrypt-ts';

const HASH_ERROR_RESPONSE = 'invalid hash';

export function createHash<T>(value: T) {
    const salt = genSaltSync(10);
    const hash = hashSync(JSON.stringify(value), salt);
    return hash;
}

export async function onValidateHash(
    browserHash: string | undefined,
    users: InputDataBaseType[],
) {
    if (!browserHash) return HASH_ERROR_RESPONSE;
    const validation = { isValid: false };

    users.map((user) => {
        const stringifiedUser = JSON.stringify({
            username: user.username.value,
        });
        if (compareSync(stringifiedUser, browserHash)) {
            validation.isValid = true;
        }
    });
    return validation.isValid;
}
