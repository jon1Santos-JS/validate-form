import type { NextApiRequest, NextApiResponse } from 'next';
import { signUpController } from '@/lib/controllers';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const user: AccountFromClientType = req.body;
    const controllerResponse = await signUpController(user);
    res.status(200).json(controllerResponse);
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
