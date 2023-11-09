import type { NextApiResponse } from 'next';
import Cookies from 'cookies';
import { createHash } from '@/lib/bcryptAdapter';
import { updateUsernameController } from '@/controllers/UpdateUserController';
import { IncomingMessage } from 'http';
import { COOKIES_EXPIRES, USER_HASH_NAME } from '@/lib/cookies';

interface NextApiRequest<T> extends IncomingMessage {
    body: T;
}

export default async function handler(
    req: NextApiRequest<UserWithNewUsername>,
    res: NextApiResponse,
) {
    switch (req.method) {
        case 'POST': {
            const controllerResponse = await updateUsernameController(req.body);
            if (!controllerResponse.success) {
                return res.status(500).json(controllerResponse);
            }
            const newAccount = {
                username: req.body.newUsername,
                password: req.body.password,
            };
            const hash = createHash(newAccount);
            const cookies = new Cookies(req, res);
            cookies.set(USER_HASH_NAME, hash, {
                expires: COOKIES_EXPIRES,
                sameSite: 'lax',
            });
            return res.status(200).json({
                serverResponse: true,
                body: req.body.username.value,
            });
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
