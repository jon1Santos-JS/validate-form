// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { handleDBController } from '@/lib/DB-API-controller';
import type { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'GET')
        res.status(200).json(await handleDBController('getDB'));
    if (req.method === 'DELETE')
        res.status(200).json(await handleDBController('reset'));
}
