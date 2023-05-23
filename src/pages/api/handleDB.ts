// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
    getDBStateController,
    resetOrRefreshDBStateController,
} from '@/lib/DB-API-controller';
import type { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'GET') {
        const response = await getDBStateController();
        res.status(200).json({ serverResponse: response });
    }
    if (req.method === 'DELETE') {
        const response = await resetOrRefreshDBStateController('reset');
        res.status(200).json({ serverResponse: response });
    }
}
