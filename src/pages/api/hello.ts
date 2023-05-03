// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { MiniDB } from './miniDB';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    handleDB(req);
    res.status(200).send('ok');
}
async function handleDB(req: NextApiRequest) {
    const miniDB = new MiniDB();
    await miniDB.init();
    await miniDB.createAccount(req.body);
    console.log('----------------------------');
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
