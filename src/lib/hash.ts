import { compareSync, genSaltSync, hashSync } from 'bcrypt-ts';

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
    const validation = { isValid: false };
    if (!browserHash) {
        console.log('invalid hash');
        return validation.isValid;
    }

    users.forEach((user) => {
        const stringifiedUser = JSON.stringify(user);
        if (compareSync(stringifiedUser, browserHash)) {
            validation.isValid = true;
        }
    });
    return validation.isValid;
}
