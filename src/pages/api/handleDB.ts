// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
    getDBStateController,
    resetDBStateController,
} from '@/lib/controllers';
import { readFile, readFileSync, writeFile, writeFileSync } from 'fs';
import type { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'GET') {
        // const controllerResponse = await getDBStateController();
        writeFile('test-file', 'oi', (data) => res.status(200).send(data));
    }
    if (req.method === 'DELETE') {
        // const controllerResponse = await resetDBStateController('reset');
        readFile('test-file', (err, data) =>
            res.status(200).send(JSON.stringify(data)),
        );
    }
}
