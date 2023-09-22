import type { NextApiRequest, NextApiResponse } from 'next';
import { USER_HASH_NAME, createHash, returnUserByHash } from '@/lib/hash';
import { getUserStateController, signInController } from '@/lib/controllers';
import Cookies from 'cookies';
import { COOKIES_EXPIRES } from '@/database/miniDB';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const cookies = new Cookies(req, res);
    switch (req.method) {
        case 'GET': {
            const browserHash = cookies.get(USER_HASH_NAME);
            const controllerResponse = await getUserStateController();
            if (typeof controllerResponse.body === 'string')
                return res.status(200).json(controllerResponse);
            const usersFromDB = controllerResponse.body;
            const hashResponse = await returnUserByHash(
                browserHash,
                usersFromDB,
            );
            return res.status(200).json(hashResponse);
        }
        case 'POST': {
            const user: UserFromClientType = req.body;
            const controllerResponse = await signInController(user); //
            if (controllerResponse.serverResponse) {
                const hash = createHash(user);
                cookies.set(USER_HASH_NAME, hash, {
                    expires: COOKIES_EXPIRES,
                    sameSite: 'lax',
                });
            }
            return res.status(200).json(controllerResponse);
        }
        case 'DELETE': {
            cookies.set(USER_HASH_NAME);
            const response = { serverResponse: true, body: 'User logged out' };
            return res.status(200).json(response);
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
