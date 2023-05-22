import { compareSync, genSaltSync, hashSync } from 'bcrypt-ts';
import { onHandleDB } from './DBcontroller';

export function createHash<T>(value: T) {
    const salt = genSaltSync(10);
    const hash = hashSync(JSON.stringify(value), salt);
    return hash;
}

export async function onValidateHash(browserHash: string) {
    const validation = { isLogged: false };
    const response = await onHandleDB('getUsers');
    if (!response || typeof response === 'string') return validation.isLogged;

    const users = response;
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
