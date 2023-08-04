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
    switch (req.method) {
        case 'GET':
            {
                const browserHash = cookies.get('user-hash');
                const hashResponse = await returnUserByHash(browserHash);
                res.status(200).json(hashResponse);
            }
            break;
        case 'POST':
            {
                const user: UserFromClientType = req.body;
                const controllerResponse = await signInController(user);
                if (controllerResponse.serverResponse) {
                    const hash = createHash(user);
                    cookies.set('user-hash', hash, {
                        expires: COOKIES_EXPIRES,
                        sameSite: 'lax',
                    });
                }
                res.status(200).json(controllerResponse);
            }
            break;
        case 'DELETE': {
            cookies.set('user-hash');
            const response = { serverResponse: true, body: 'User logged out' };
            res.status(200).json(response);
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
