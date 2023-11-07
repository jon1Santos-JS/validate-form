import type { NextApiRequest, NextApiResponse } from 'next';
import { changeUsernameController } from '@/lib/controllers';
import Cookies from 'cookies';
import { COOKIES_EXPIRES, USER_HASH_NAME, createHash } from '@/lib/hash';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    switch (req.method) {
        case 'POST': {
            const userFromClient: ChangeUsernameFromClient = req.body;
            const controllerResponse = await changeUsernameController(
                userFromClient,
            );
            if (typeof controllerResponse.body === 'string') {
                return res.status(500).json(controllerResponse);
            }
            const newAccountFromDB = controllerResponse.body;
            const hash = createHash(newAccountFromDB);
            const cookies = new Cookies(req, res);
            cookies.set(USER_HASH_NAME, hash, {
                expires: COOKIES_EXPIRES,
                sameSite: 'lax',
            });
            return res.status(200).json({
                serverResponse: true,
                body: newAccountFromDB.username.value,
            });
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
