import { updateUserImageController } from '@/controllers/UpdateUserController';
import CookiesAdapter, { USER_HASH_NAME } from '@/lib/cookiesAdapter';
import { IncomingMessage } from 'http';
import { NextApiResponse } from 'next';

interface NextApiRequest<T> extends IncomingMessage {
    body: T;
}

export default async function handler(
    req: NextApiRequest<NewUserImage>,
    res: NextApiResponse,
) {
    const cookies = new CookiesAdapter(req, res);
    switch (req.method) {
        case 'POST': {
            const browserHash = cookies.get(USER_HASH_NAME);
            const response = await updateUserImageController(
                browserHash,
                req.body,
            );
            if (!response.success) return res.status(500).json(response);
            return res.status(200).json(response);
        }
        default:
            return res
                .status(405)
                .json({ success: false, data: 'Method Not Allowed' });
    }
}

export const config = {
    api: {
        bodyParser: '1mb',
    },
};