import type { NextApiResponse } from 'next';
import Cookies from 'cookies';
import { signUpController } from '@/controllers/RegisterUserController';
import { IncomingMessage } from 'http';
import { USER_HASH_NAME } from '@/lib/cookies';

interface NextApiRequest<T> extends IncomingMessage {
    body: T;
}

export default async function handler(
    req: NextApiRequest<UserFromClient>,
    res: NextApiResponse,
) {
    const cookies = new Cookies(req, res);
    switch (req.method) {
        case 'POST': {
            cookies.set(USER_HASH_NAME);
            const controllerResponse = await signUpController(req.body);
            if (!controllerResponse.success)
                return res.status(500).json(controllerResponse);
            return res.status(200).json(controllerResponse);
        }
        default: {
            return res
                .status(405)
                .json({ success: false, data: 'Method Not Allowed' });
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
