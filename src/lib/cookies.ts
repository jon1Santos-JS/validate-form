import Cookies from 'cookies';
import { NextApiRequest, NextApiResponse } from 'next';
import { createHash } from './hash';

export function setCookie<T>(
    req: NextApiRequest,
    res: NextApiResponse,
    name: string,
    value: T,
) {
    const cookies = new Cookies(req, res);
    const hash = createHash<T>(value);
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
