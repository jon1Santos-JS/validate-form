import { compareSync, genSaltSync, hashSync } from 'bcrypt-ts';
import { handleDBController } from './DB-API-controller';

export function createHash<T>(value: T) {
    const salt = genSaltSync(10);
    const hash = hashSync(JSON.stringify(value), salt);
    return hash;
}

export async function onValidateHash(browserHash: string | undefined) {
    if (!browserHash) return 'internal server error';
    const validation = { isLogged: false };
    const response = await handleDBController('getUsers');
    if (!response) return validation.isLogged;

    const users: InputDataBaseType[] = JSON.parse(response);
    users.map((user) => {
        const stringifiedUser = JSON.stringify({
            username: user.username.value,
        });
        if (compareSync(stringifiedUser, browserHash)) {
            validation.isLogged = true;
        }
    });
    return validation.isLogged;
}
