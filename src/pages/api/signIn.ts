// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { MiniDB } from './miniDB';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    handleDB(req, res);
    res.status(200).send('ok');
}
async function handleDB(req: NextApiRequest, res: NextApiResponse) {
    const miniDB = new MiniDB();
    await miniDB.init();
    const acc = miniDB.logIn(req.body);
    res.send(JSON.stringify(acc));
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
