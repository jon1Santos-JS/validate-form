// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MiniDBHandler } from '@/database/miniDBHandler';
import type { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'GET') res.status(200).send(await onHandleDB('get'));
    if (req.method === 'DELETE')
        res.status(200).send(await onHandleDB('reset'));
}

async function onHandleDB(comand: HandleDBComandType) {
    const miniDB = new MiniDBHandler();
    const dbResponse = await miniDB.handleDB(comand);
    return JSON.stringify(dbResponse);
}
