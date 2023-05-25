// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
    getDBStateController,
    resetDBStateController,
} from '@/lib/controllers';
import type { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'GET') {
        const controllerResponse = await getDBStateController();
        res.status(200).json(controllerResponse);
    }
    if (req.method === 'DELETE') {
        const controllerResponse = await resetDBStateController('reset');
        res.status(200).json(controllerResponse);
    }
}
