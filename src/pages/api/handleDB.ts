// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
    getDBStateController,
    resetDBStateController,
} from '@/lib/controllers';
import { readFileSync, writeFileSync } from 'fs';
import type { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'GET') {
        // const controllerResponse = await getDBStateController();
        try {
            await writeFileSync('test-file', JSON.stringify({ test: 'oi' }));
            res.status(200).send('escreveu parece');
        } catch {
            res.status(200).send('deu ruim');
        }
    }
    if (req.method === 'DELETE') {
        // const controllerResponse = await resetDBStateController('reset');
        try {
            const data = await readFileSync('test-file', 'utf8');
            res.status(200).json(JSON.parse(data));
        } catch {
            res.status(200).json('deu ruim');
        }
    }
}
