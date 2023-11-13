import type { NextApiResponse } from 'next';
import { createHash } from '@/lib/bcryptAdapter';
import {
    authUserController,
    signInController,
} from '@/controllers/AuthUserController';
import CookiesAdapter from '@/lib/cookiesAdapter';
import { IncomingMessage } from 'http';
import { USER_HASH_NAME } from '@/database/DBHandler/DBState';

interface NextApiRequest<T> extends IncomingMessage {
    body: T;
}

export default async function handler(
    req: NextApiRequest<UserFromClient>,
    res: NextApiResponse,
) {
    const cookies = new CookiesAdapter(req, res);
    switch (req.method) {
        case 'GET': {
            const browserHash = cookies.get(USER_HASH_NAME);
            const controllerResponse = await authUserController(browserHash);
            if (!controllerResponse.success)
                return res.status(500).json(controllerResponse);
            return res.status(200).json(controllerResponse);
        }
        case 'POST': {
            const controllerResponse = await signInController(req.body);
            if (!controllerResponse.success)
                return res.status(500).json(controllerResponse);
            const hash = createHash(req.body);
            cookies.set(USER_HASH_NAME, hash);
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
