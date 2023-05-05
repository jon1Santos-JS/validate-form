// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { MiniDB } from './miniDB';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).send(handleDB(req));
}
async function handleDB(req: NextApiRequest) {
    const miniDB = new MiniDB();
    await miniDB.init();
    const acc = miniDB.logIn(req.body);
    return JSON.stringify(acc);
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
