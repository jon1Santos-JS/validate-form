import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteAccount } from '@/lib/controllers';
import { USER_HASH_NAME } from '@/lib/hash';
import Cookies from 'cookies';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    switch (req.method) {
        case 'POST': {
            const cookies = new Cookies(req, res);
            const username = req.body;
            const controllerResponse = await deleteAccount(username);
            if (controllerResponse.serverResponse) cookies.set(USER_HASH_NAME);
            return res.status(405).json(controllerResponse);
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
