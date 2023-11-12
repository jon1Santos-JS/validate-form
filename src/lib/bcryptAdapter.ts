import { hashSync, genSaltSync, compareSync } from 'bcrypt-ts';

export function createHash(user: UserFromClient) {
    const salt = genSaltSync(10);
    const stringifiedValue = JSON.stringify(user);
    const hash = hashSync(stringifiedValue, salt);
    return hash;
}

export function compareSyncBcrypt(content: string, hash: string) {
    return compareSync(content, hash);
}
