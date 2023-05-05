// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { MiniDB } from './miniDB';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    res.status(200).send(await handleDB());
}
async function handleDB() {
    const miniDB = new MiniDB();
    await miniDB.init();
    const DB = await miniDB.returnDB();
    console.log(DB);
    return JSON.stringify(DB, undefined, 2);
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
