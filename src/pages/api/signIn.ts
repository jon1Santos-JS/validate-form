// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie, getCookie, setCookie } from '@/lib/cookies';
import { onValidateHash } from '@/lib/hash';
import { signInController } from '@/lib/DB-API-controller';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'GET') {
        const browserCookie = getCookie(req, res, 'login');
        const response = await onValidateHash(browserCookie);
        const conditionalResponse = response ? { user: true } : { user: false };
        res.status(200).json(conditionalResponse);
    }
    if (req.method === 'POST') {
        const response = await signInController(req.body);
        if (response) setCookie(req, res, 'login', response);
        const conditionalResponse = response ? { user: true } : { user: false };
        res.status(200).json(JSON.stringify(conditionalResponse));
    }
    if (req.method === 'DELETE') {
        destroyCookie(req, res, 'login');
        res.status(200).json(JSON.stringify({ user: false }));
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
