import type { NextApiRequest, NextApiResponse } from 'next';
import { changeUsernameController } from '@/lib/controllers';
import Cookies from 'cookies';
import { createHash } from '@/lib/hash';
import { COOKIES_EXPIRES } from '@/database/miniDB';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    switch (req.method) {
        case 'POST': {
            const userFromClient: ChangeUsernameFromClientType = req.body;
            const controllerResponse = await changeUsernameController(
                userFromClient,
            );
            if (
                !controllerResponse.serverResponse ||
                typeof controllerResponse.body === 'string'
            ) {
                res.status(200).json(controllerResponse);
                return;
            }
            const newAccountFromDB = controllerResponse.body;
            const hash = createHash(newAccountFromDB);
            const cookies = new Cookies(req, res);
            cookies.set('user-hash', hash, {
                expires: COOKIES_EXPIRES,
                sameSite: 'lax',
            });
            res.status(200).json({
                serverResponse: true,
                body: newAccountFromDB.username.value,
            });
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
