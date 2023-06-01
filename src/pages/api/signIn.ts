// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { createHash } from '@/lib/hash';
import { getUserStateController, signInController } from '@/lib/controllers';
import Cookies from 'cookies';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const cookies = new Cookies(req, res);
    if (req.method === 'GET') {
        const browserHash = cookies.get('user-hash');
        const controllerResponse = await getUserStateController(browserHash);
        res.status(200).json(controllerResponse);
    }
    if (req.method === 'POST') {
        const user: UserFromClientType = req.body;
        const controllerResponse = await signInController(user);
        if (controllerResponse.serverResponse) {
            const hash = createHash(user);
            cookies.set('user-hash', hash, { httpOnly: false });
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
