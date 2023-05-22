// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { signUp } from '@/lib/DBcontroller';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const response = await signUp(req.body as InputDataBaseType);
    const conditionalResponse = response ? { user: true } : { user: false };
    res.status(200).json(JSON.stringify(conditionalResponse));
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
