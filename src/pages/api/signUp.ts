import type { NextApiResponse } from 'next';
import { signUpController } from '@/controllers/RegisterUserController';
import { IncomingMessage } from 'http';
import CookiesAdapter from '@/lib/cookiesAdapter';
import { USER_HASH_NAME } from '@/database/DBHandler/DBState';

interface NextApiRequest<T> extends IncomingMessage {
    body: T;
}

export default async function handler(
    req: NextApiRequest<UserFromClient>,
    res: NextApiResponse,
) {
    const cookies = new CookiesAdapter(req, res);
    switch (req.method) {
        case 'POST': {
            cookies.set(USER_HASH_NAME);
            const response = await signUpController(req.body);
            if (!response.success) return res.status(500).json(response);
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
