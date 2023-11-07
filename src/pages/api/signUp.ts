import type { NextApiRequest, NextApiResponse } from 'next';
import { signUpController } from '@/lib/controllers';
import Cookies from 'cookies';
import { USER_HASH_NAME } from '@/lib/hash';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const cookies = new Cookies(req, res);
    switch (req.method) {
        case 'POST': {
            cookies.set(USER_HASH_NAME);
            const user: UserFromClient = req.body;
            const controllerResponse = await signUpController(user);
            if (!controllerResponse.serverResponse)
                return res.status(500).json(controllerResponse);
            return res.status(200).json(controllerResponse);
        }
        default: {
            return res
                .status(405)
                .json({ serverResponse: 'Method Not Allowed' });
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
