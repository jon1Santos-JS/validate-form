// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie, getCookie, setCookie } from '@/lib/cookies';
import { onValidateHash } from '@/lib/hash';
import {
    getDBUsersController,
    signInController,
} from '@/lib/DB-API-controller';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'GET') {
        const browserCookie = getCookie(req, res, 'user-hash');
        const controllerResponse = await getDBUsersController();
        if (typeof controllerResponse !== 'string') {
            const users = controllerResponse;
            const validatedHash = await onValidateHash(browserCookie, users);
            const response = { serverResponse: validatedHash };
            res.status(200).json(response);
            return;
        }
        res.status(200).json({ serverResponse: controllerResponse });
    }
    if (req.method === 'POST') {
        const controllerResponse = await signInController(req.body);
        const response = { serverResponse: false };
        if (typeof controllerResponse !== 'string') {
            const user = controllerResponse;
            setCookie(req, res, 'user-hash', user);
            response.serverResponse = true;
            res.status(200).json(response);
            return;
        }
        res.status(200).json({ serverResponse: controllerResponse });
    }
    if (req.method === 'DELETE') {
        destroyCookie(req, res, 'user-hash');
        res.status(200).json({ serverResponse: true });
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
