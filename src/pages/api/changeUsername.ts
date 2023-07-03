import type { NextApiRequest, NextApiResponse } from 'next';
import { changeUsernameController } from '@/lib/controllers';
import Cookies from 'cookies';
import { createHash } from '@/lib/hash';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'POST') {
        const userFromClient: ChangeUsernameFromClientType = req.body;
        const controllerResponse = await changeUsernameController(
            userFromClient,
        );
        if (typeof controllerResponse.serverResponse === 'boolean') {
            res.status(200).json(controllerResponse);
            return;
        }
        const newUserAccountFromDB = controllerResponse.serverResponse;
        const hash = createHash(newUserAccountFromDB);
        const cookies = new Cookies(req, res);
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 60 * 2);
        cookies.set('user-hash', hash, { expires });
        res.status(200).json({
            serverResponse: newUserAccountFromDB.username.value,
        });
        return;
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
