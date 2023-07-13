import type { NextApiRequest, NextApiResponse } from 'next';
import { changePasswordController } from '@/lib/controllers';
import { createHash } from '@/lib/hash';
import Cookies from 'cookies';
import { COOKIES_EXPIRES } from '@/database/miniDB';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    switch (req.method) {
        case 'POST': {
            const user: ChangePasswordFromClientType = req.body;
            const controllerResponse = await changePasswordController(user);
            if (controllerResponse.serverResponse) {
                const cookies = new Cookies(req, res);
                const userToSetHash = {
                    username: { value: user.username.value },
                    password: { value: user.newPassword.value },
                };
                const hash = createHash(userToSetHash);
                cookies.set('user-hash', hash, {
                    expires: COOKIES_EXPIRES,
                    sameSite: 'lax',
                });
            }
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
