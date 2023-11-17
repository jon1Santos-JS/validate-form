import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteAccountController } from '@/controllers/DeleteUserController';
import CookiesAdapter from '@/lib/cookiesAdapter';
import { USER_HASH_NAME } from '@/database/DBHandler/DBState';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const cookies = new CookiesAdapter(req, res);
    switch (req.method) {
        case 'GET': {
            const browserHash = cookies.get(USER_HASH_NAME);
            const response = await deleteAccountController(browserHash);
            if (!response.success) return res.status(500).json(response);
            cookies.set(USER_HASH_NAME);
            return res.status(200).json(response);
        }
        default: {
            return res
                .status(405)
                .json({ success: false, data: 'Method Not Allowed' });
        }
    }
}
