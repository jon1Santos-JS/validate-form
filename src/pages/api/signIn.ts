import type { NextApiRequest, NextApiResponse } from 'next';
import { createHash, returnUserByHash } from '@/lib/hash';
import { getUserStateController, signInController } from '@/lib/controllers';
import Cookies from 'cookies';
import { ADMINS_ACCOUNT, COOKIES_EXPIRES } from '@/database/miniDB';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const cookies = new Cookies(req, res);
    if (req.method === 'GET') {
        const browserHash = cookies.get('user-hash');
        const controllerResponse = await getUserStateController();
        if (controllerResponse.serverResponse) {
            const DBusers = controllerResponse.body;
            let hashResponse = await returnUserByHash(browserHash, DBusers);

            // IF THERE'S NO DATABASE USERS, IT'S COMPARING ADMIN'S ACCOUNT TO HASH
            if (!hashResponse.isValid) {
                hashResponse = await returnUserByHash(
                    browserHash,
                    ADMINS_ACCOUNT,
                );
            }

            if (!hashResponse.isValid) {
                res.status(500).json({
                    serverResponse: hashResponse.isValid,
                    body: hashResponse.message,
                });
                return;
            }
            res.status(200).json({
                serverResponse: hashResponse.isValid,
                body: (hashResponse.user as UserFromClientType).username.value,
            });
            return;
        }
        res.status(500).send('internal error');
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
