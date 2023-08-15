import type { NextApiRequest, NextApiResponse } from 'next';
import { createHash, returnUserByHash } from '@/lib/hash';
import { signInController } from '@/lib/controllers';
import Cookies from 'cookies';
import { COOKIES_EXPIRES } from '@/database/miniDB';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const cookies = new Cookies(req, res);
    if (req.method === 'GET') {
        const browserHash = cookies.get('user-hash');
        const hashResponse = await returnUserByHash(browserHash);
        return res.status(200).json(hashResponse);
    }

    if (req.method === 'POST') {
        const user: UserFromClientType = req.body;
        const controllerResponse = await signInController(user); //
        if (controllerResponse.serverResponse) {
            const hash = createHash(user);
            cookies.set('user-hash', hash, {
                expires: COOKIES_EXPIRES,
                sameSite: 'lax',
            });
        }
        return res.status(200).json(controllerResponse);
    }

    if (req.method === 'DELETE') {
        cookies.set('user-hash');
        const response = { serverResponse: true, body: 'User logged out' };
        return res.status(200).json(response);
    }
    return res.status(405).json({ serverResponse: 'Method Not Allowed' });
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
