import type { NextApiRequest, NextApiResponse } from 'next';
import {
    deleteAccountController,
    getUserStateController,
    resetDBController,
} from '@/lib/controllers';
import { USER_HASH_NAME, returnUserByHash } from '@/lib/hash';
import Cookies from 'cookies';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const cookies = new Cookies(req, res);
    switch (req.method) {
        case 'POST': {
            const username = req.body;
            const controllerResponse = await deleteAccountController(username);
            if (controllerResponse.serverResponse) cookies.set(USER_HASH_NAME);
            return res.status(200).json(controllerResponse);
        }
        case 'GET': {
            const browserHash = cookies.get(USER_HASH_NAME);
            const getUsersControllerResponse = await getUserStateController();
            if (typeof getUsersControllerResponse.body === 'string')
                return res.status(200).json(getUsersControllerResponse);
            const usersFromDB = getUsersControllerResponse.body;
            const hashResponse = await returnUserByHash(
                browserHash,
                usersFromDB,
            );
            if (typeof hashResponse.body === 'string')
                return res.status(500).json(hashResponse);
            const resetDBControllerResponse = await resetDBController(
                hashResponse.body.username,
            );
            return res.status(500).json(resetDBControllerResponse);
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
