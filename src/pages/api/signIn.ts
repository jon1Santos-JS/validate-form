import type { NextApiRequest, NextApiResponse } from 'next';
import { HASH_ERROR_RESPONSE, createHash, returnUserByHash } from '@/lib/hash';
import { getUserStateController, signInController } from '@/lib/controllers';
import Cookies from 'cookies';
import { ADMIN_ACCOUNT, COOKIES_EXPIRES } from '@/database/miniDB';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const cookies = new Cookies(req, res);
    if (req.method === 'GET') {
        const browserHash = cookies.get('user-hash');
        if (!browserHash) {
            res.status(200).json({
                serverResponse: false,
                body: HASH_ERROR_RESPONSE,
            });
            return;
        }
        const controllerResponse = await getUserStateController();

        if (controllerResponse.serverResponse) {
            const DBusers = controllerResponse.body;
            let user = await returnUserByHash(browserHash, DBusers);
            if (!user) {
                // IF THERE'S NO DATABASE USERS, IT'S COMPARING ADMIN'S ACCOUNT TO HASH
                user = await returnUserByHash(browserHash, [ADMIN_ACCOUNT]);
            }
            if (!user) {
                res.status(200).json({
                    serverResponse: false,
                    body: 'User was not found by hash',
                });
                return;
            }
            res.status(200).json({
                serverResponse: true,
                body: user.username.value,
            });
            return;
        }

        return;
    }
    if (req.method === 'POST') {
        const user: AccountFromClientType = req.body;
        const controllerResponse = await signInController(user);
        if (controllerResponse.serverResponse) {
            const hash = createHash(user);
            cookies.set('user-hash', hash, { expires: COOKIES_EXPIRES });
        }
        res.status(200).json(controllerResponse);
    }
    if (req.method === 'DELETE') {
        cookies.set('user-hash');
        const response = { serverResponse: true, body: 'User logged out' };
        res.status(200).json(response);
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
