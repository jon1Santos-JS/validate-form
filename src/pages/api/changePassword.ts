import type { NextApiRequest, NextApiResponse } from 'next';
import { changePasswordController } from '@/lib/controllers';
import { COOKIES_EXPIRES, USER_HASH_NAME, createHash } from '@/lib/hash';
import Cookies from 'cookies';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    switch (req.method) {
        case 'POST': {
            const user: ChangePasswordFromClient = req.body;
            const controllerResponse = await changePasswordController(user);
            if (!controllerResponse.serverResponse) {
                return res.status(500).json(controllerResponse);
            }
            const cookies = new Cookies(req, res);
            const userToSetHash = {
                username: user.username,
                password: user.newPassword,
            };
            const hash = createHash(userToSetHash);
            cookies.set(USER_HASH_NAME, hash, {
                expires: COOKIES_EXPIRES,
                sameSite: 'lax',
            });
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
