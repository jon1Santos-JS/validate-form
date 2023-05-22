// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { onHandleDB } from '@/lib/DBcontroller';
import type { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'GET') res.status(200).json(await onHandleDB('getDB'));
    if (req.method === 'DELETE')
        res.status(200).json(await onHandleDB('reset'));
}
