import type { NextApiRequest, NextApiResponse } from 'next';
import { signUpController } from '@/lib/controllers';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    switch (req.method) {
        case 'POST': {
            const user: AccountFromClientType = req.body;
            const controllerResponse = await signUpController(user);
            res.status(200).json(controllerResponse);
            break;
        }
        default: {
            res.status(405).json({ serverResponse: 'Method Not Allowed' });
            break;
        }
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
