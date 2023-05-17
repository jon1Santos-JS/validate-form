// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { MiniDBAccountHandler } from '../../database/accountHandler';
import Cookies from 'cookies';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const cookies = new Cookies(req, res);
    cookies.set('joni', 'value', { httpOnly: true });
    res.status(200).send(await onHandleDB(req));
}
async function onHandleDB(req: NextApiRequest) {
    const accountsHandler = new MiniDBAccountHandler();
    const response = await accountsHandler.signIn(req.body);
    return JSON.stringify(response);
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
