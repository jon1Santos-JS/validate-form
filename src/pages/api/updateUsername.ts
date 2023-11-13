import type { NextApiResponse } from 'next';
import { createHash } from '@/lib/bcryptAdapter';
import { updateUsernameController } from '@/controllers/UpdateUserController';
import { IncomingMessage } from 'http';
import CookiesAdapter, { USER_HASH_NAME } from '@/lib/cookiesAdapter';

interface NextApiRequest<T> extends IncomingMessage {
    body: T;
}

export default async function handler(
    req: NextApiRequest<UserWithNewUsername>,
    res: NextApiResponse,
) {
    const cookies = new CookiesAdapter(req, res);
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
            cookies.set(USER_HASH_NAME, hash);
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
