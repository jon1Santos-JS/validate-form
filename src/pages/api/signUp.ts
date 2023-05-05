// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { MiniDB } from './miniDB';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    res.status(200).send(await handleDB(req));
}
async function handleDB(req: NextApiRequest) {
    const miniDB = new MiniDB();
    await miniDB.init();
    return await miniDB.createAccount(req.body);
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
