import type { NextApiResponse } from 'next';
import { createHash } from '@/lib/bcryptAdapter';
import Cookies from 'cookies';
import {
    authUserControler,
    signInController,
} from '@/controllers/AuthUserController';
import { COOKIES_EXPIRES, USER_HASH_NAME } from '@/lib/cookies';
import { IncomingMessage } from 'http';

interface NextApiRequest<T> extends IncomingMessage {
    body: T;
}

export default async function handler(
    req: NextApiRequest<UserFromClient>,
    res: NextApiResponse,
) {
    const cookies = new Cookies(req, res);
    switch (req.method) {
        case 'GET': {
            const browserHash = cookies.get(USER_HASH_NAME);
            const controllerResponse = await authUserControler(browserHash);
            if (!controllerResponse.success)
                return res.status(500).json(controllerResponse);
            return res.status(200).json(controllerResponse);
        }
        case 'POST': {
            const controllerResponse = await signInController(req.body);
            if (!controllerResponse.success)
                return res.status(500).json(controllerResponse);
            const hash = createHash(req.body);
            cookies.set(USER_HASH_NAME, hash, {
                expires: COOKIES_EXPIRES,
                sameSite: 'lax',
            });
            return res.status(200).json(controllerResponse);
        }
        case 'DELETE': {
            cookies.set(USER_HASH_NAME);
            const response = { success: true, data: 'User logged out' };
            return res.status(200).json(response);
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
