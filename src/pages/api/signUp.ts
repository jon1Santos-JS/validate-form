// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { MiniDBAccountHandler } from '../../database/accountHandler';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    res.status(200).send(await onHandleDB(req));
}
async function onHandleDB(req: NextApiRequest) {
    const accountsHandler = new MiniDBAccountHandler();
    const response = await accountsHandler.signUp(req.body);
    return response;
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
