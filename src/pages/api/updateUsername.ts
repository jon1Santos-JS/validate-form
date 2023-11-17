import type { NextApiResponse } from 'next';
import { createHash } from '@/lib/bcryptAdapter';
import { updateUsernameController } from '@/controllers/UpdateUserController';
import { IncomingMessage } from 'http';
import CookiesAdapter from '@/lib/cookiesAdapter';
import { USER_HASH_NAME } from '@/database/DBHandler/DBState';

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
            const response = await updateUsernameController(req.body);
            if (!response.success) {
                return res.status(500).json(response);
            }
            const newAccount = {
                username: req.body.newUsername,
                password: req.body.password,
            };
            const hash = createHash(newAccount);
            cookies.set(USER_HASH_NAME, hash);
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
