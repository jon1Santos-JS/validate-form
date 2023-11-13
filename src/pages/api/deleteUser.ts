import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteAccountController } from '@/controllers/DeleteUserController';
import CookiesAdapter, { USER_HASH_NAME } from '@/lib/cookiesAdapter';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const cookies = new CookiesAdapter(req, res);
    switch (req.method) {
        case 'GET': {
            const browserHash = cookies.get(USER_HASH_NAME);
            const controllerResponse = await deleteAccountController(
                browserHash,
            );
            if (!controllerResponse.success)
                return res.status(500).json(controllerResponse);
            cookies.set(USER_HASH_NAME);
            return res.status(200).json(controllerResponse);
        }
        default: {
            return res
                .status(405)
                .json({ success: false, data: 'Method Not Allowed' });
        }
    }
}
