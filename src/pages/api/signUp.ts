import type { NextApiRequest, NextApiResponse } from 'next';
import { signUpController } from '@/lib/controllers';
import Cookies from 'cookies';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const cookies = new Cookies(req, res);
    switch (req.method) {
        case 'POST': {
            cookies.set('user-hash');
            const user: UserFromClientType = req.body;
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
