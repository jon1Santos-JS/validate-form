import type { NextApiRequest, NextApiResponse } from 'next';
import { HASH_DEFAULT_ERROR, createHash, returnUserByHash } from '@/lib/hash';
import { getUserStateController, signInController } from '@/lib/controllers';
import Cookies from 'cookies';
import { ADMINS_ACCOUNT, COOKIES_EXPIRES } from '@/database/miniDB';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const cookies = new Cookies(req, res);
    switch (req.method) {
        case 'GET':
            {
                const browserHash = cookies.get('user-hash');
                if (!browserHash) {
                    res.status(200).json({
                        serverResponse: false,
                        body: HASH_DEFAULT_ERROR,
                    });
                    return;
                }
                const controllerResponse = await getUserStateController();
                if (controllerResponse.serverResponse) {
                    const DBusers = controllerResponse.body;
                    const hashResponse = await returnUserByHash(
                        browserHash,
                        DBusers,
                    );
                    const conditional = hashResponse.isValid
                        ? hashResponse.user
                        : hashResponse.message;

                    res.status(200).json({
                        serverResponse: hashResponse.isValid,
                        body: conditional,
                    });
                    return;
                }

                // IF THERE'S NO DATABASE USERS, IT'S COMPARING ADMIN'S ACCOUNT TO HASH
                const hashResponse = await returnUserByHash(
                    browserHash,
                    ADMINS_ACCOUNT,
                );
                const conditional = hashResponse.isValid
                    ? hashResponse.user
                    : hashResponse.message;

                res.status(200).json({
                    serverResponse: hashResponse.isValid,
                    body: conditional,
                });
            }
            break;
        case 'POST':
            {
                const user: AccountFromClientType = req.body;
                const controllerResponse = await signInController(user);
                if (controllerResponse.serverResponse) {
                    const hash = createHash(user);
                    cookies.set('user-hash', hash, {
                        expires: COOKIES_EXPIRES,
                        sameSite: 'lax',
                    });
                }
                res.status(200).json(controllerResponse);
            }
            break;
        case 'DELETE': {
            cookies.set('user-hash');
            const response = { serverResponse: true, body: 'User logged out' };
            res.status(200).json(response);
            break;
        }
        default: {
            res.status(405).json({ serverResponse: 'Method Not Allowed' });
            break;
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
