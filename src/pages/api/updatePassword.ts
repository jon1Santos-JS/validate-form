import type { NextApiResponse } from 'next';
import { createHash } from '@/lib/bcryptAdapter';
import Cookies from 'cookies';
import { updatePasswordController } from '@/controllers/UpdateUserController';
import { IncomingMessage } from 'http';
import { COOKIES_EXPIRES, USER_HASH_NAME } from '@/lib/cookies';

interface NextApiRequest<T> extends IncomingMessage {
    body: T;
}

export default async function handler(
    req: NextApiRequest<UserWithNewPassword>,
    res: NextApiResponse,
) {
    switch (req.method) {
        case 'POST': {
            const controllerResponse = await updatePasswordController(req.body);
            if (!controllerResponse.success) {
                return res.status(500).json(controllerResponse);
            }
            const cookies = new Cookies(req, res);
            const hash = createHash({
                ...req.body,
                password: req.body.newPassword,
            });
            cookies.set(USER_HASH_NAME, hash, {
                expires: COOKIES_EXPIRES,
                sameSite: 'lax',
            });
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
