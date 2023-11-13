import Cookies from 'cookies';
import { IncomingMessage } from 'http';
import { NextApiResponse } from 'next';

const HOUR = 1000 * 60 * 60;
export const USER_HASH_NAME = 'user-hash';
export const COOKIES_EXPIRES = new Date(Date.now() + HOUR * 2);

export default class CookiesAdapter<T extends IncomingMessage> {
    #cookies: Cookies;
    constructor(req: T, res: NextApiResponse) {
        this.#cookies = new Cookies(req, res);
    }

    set(name: string, value?: string | null | undefined) {
        return this.#cookies.set(name, value, {
            expires: COOKIES_EXPIRES,
        });
    }

    get(name: string, options?: Cookies.GetOption | undefined) {
        return this.#cookies.get(name, options);
    }
}
