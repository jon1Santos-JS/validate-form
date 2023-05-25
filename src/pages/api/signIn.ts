// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie, getCookie, setCookie } from '@/lib/cookies';
import { createHash } from '@/lib/hash';
import { getUserStateController, signInController } from '@/lib/controllers';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'GET') {
        const browserHash = getCookie(req, res, 'user-hash');
        const controllerResponse = await getUserStateController(browserHash);
        res.status(200).json(controllerResponse);
    }
    if (req.method === 'POST') {
        const user: UserFromClientType = req.body;
        const controllerResponse = await signInController(user);
        if (controllerResponse.serverResponse) {
            const hash = createHash(user);
            setCookie(req, res, 'user-hash', hash);
        }
        res.status(200).json(controllerResponse);
    }
    if (req.method === 'DELETE') {
        destroyCookie(req, res, 'user-hash');
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
