// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse, NextApiRequest } from 'next';
import { MiniDB } from '../../database/miniDB';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'GET') res.status(200).send(await onHandleDB('get'));
    if (req.method === 'DELETE')
        res.status(200).send(await onHandleDB('reset'));
}

async function onHandleDB(comand: HandleDBComandType) {
    const miniDB = new MiniDB();
    const dbResponse = await miniDB.handleDB(comand);
    return dbResponse;
}
