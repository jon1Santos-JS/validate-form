// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { MiniDBAccountHandler } from '../../database/accountHandler';
import Cookies from 'cookies';
import { genSaltSync, hashSync, compareSync } from 'bcrypt-ts';
import { MiniDBHandler } from '@/database/miniDBHandler';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const cookies = new Cookies(req, res);
    if (req.method === 'GET') {
        const isUserLogged = await getCookie(cookies);
        res.status(200).send(JSON.stringify(isUserLogged));
    }
    if (req.method === 'POST') {
        const isUserLogged = await logIn(req, cookies);
        const conditional = isUserLogged
            ? JSON.stringify(isUserLogged)
            : JSON.stringify({ user: false });
        res.status(200).send(conditional);
    }
    if (req.method === 'DELETE') {
        cookies.set('login');
        res.status(200).send(JSON.stringify({ user: false }));
    }
}

async function logIn(req: NextApiRequest, cookies: Cookies) {
    const accountsHandler = new MiniDBAccountHandler();
    const user = await accountsHandler.signIn(req.body);
    if (!user) return null;
    const stringifiedUser = JSON.stringify(user);
    return await setCookie(cookies, stringifiedUser);
}

async function setCookie(cookies: Cookies, user: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(user, salt);
    cookies.set('login', hash);
    return { user: true };
}

async function getCookie(cookies: Cookies) {
    const browserHash = cookies.get('login');
    if (!browserHash) return { user: false };
    return { user: await isLogged(browserHash) };
}

async function isLogged(browserHash: string) {
    const DBHandler = new MiniDBHandler();
    const users = await DBHandler.handleDB('getUsers');
    const validation = onValidateHash(users, browserHash);
    return validation;
}

function onValidateHash(
    users: string | InputDataBaseType[] | undefined,
    browserHash: string,
) {
    const validation = { isLogged: false };
    if (users && typeof users !== 'string') {
        users.map((user) => {
            const stringifiedUser = JSON.stringify({
                username: user.username.value,
            });
            if (compareSync(stringifiedUser, browserHash)) {
                validation.isLogged = true;
            }
        });
    }
    return validation.isLogged;
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
