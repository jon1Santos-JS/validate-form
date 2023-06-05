// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { createHash, onValidateHash } from '@/lib/hash';
import { getUserStateController, signInController } from '@/lib/controllers';
import Cookies from 'cookies';
import { compareSync } from 'bcrypt-ts';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const cookies = new Cookies(req, res);
    if (req.method === 'GET') {
        const browserHash = cookies.get('user-hash');
        const controllerResponse = await getUserStateController();
        if (!controllerResponse.serverResponse) {
            res.status(200).json({ serverResponse: false });
            return;
        }
        // const users = controllerResponse.serverResponse;
        // const validatedHash = await onValidateHash(browserHash, users);
        const stringifiedUser = JSON.stringify({
            username: { value: 'admin1' },
            password: { value: 'admin1' },
        });
        if (!browserHash) {
            res.status(200).json({ serverResponse: false });
            return;
        }
        res.status(200).json({
            serverResponse: compareSync(stringifiedUser, browserHash),
        });
    }
    if (req.method === 'POST') {
        const user: UserFromClientType = req.body;
        const controllerResponse = await signInController(user);
        if (controllerResponse.serverResponse) {
            const hash = createHash(user);
            cookies.set('user-hash', hash);
        }
        res.status(200).json(controllerResponse);
    }
    if (req.method === 'DELETE') {
        cookies.set('user-hash');
        const response = { serverResponse: true };
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
