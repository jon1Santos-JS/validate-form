import Cookies from 'cookies';
import { NextApiRequest, NextApiResponse } from 'next';
import { createHash } from './hash';

export function setCookie(
    req: NextApiRequest,
    res: NextApiResponse,
    name: string,
    value: SignInResponseType,
) {
    const cookies = new Cookies(req, res);
    const hash = createHash<SignInResponseType>(value);
    cookies.set(name, hash);
}

export function getCookie(
    req: NextApiRequest,
    res: NextApiResponse,
    name: string,
) {
    const cookies = new Cookies(req, res);
    const browserCookie = cookies.get(name);
    if (!browserCookie) return;
    return browserCookie;
}

export function destroyCookie(
    req: NextApiRequest,
    res: NextApiResponse,
    name: string,
) {
    const cookies = new Cookies(req, res);
    cookies.set(name);
}
