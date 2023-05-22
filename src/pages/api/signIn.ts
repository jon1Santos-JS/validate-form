// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie, getCookie, setCookie } from '@/lib/cookies';
import { onValidateHash } from '@/lib/hash';
import { logIn } from '@/lib/DBcontroller';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'GET') {
        const browserCookie = getCookie(req, res, 'login');
        const response = await onCheckLoginState(browserCookie);
        res.status(200).json(response);
    }
    if (req.method === 'POST') {
        const user = await logIn(req.body as InputDataBaseType);
        if (user) setCookie(req, res, 'login', user);
        const conditionalResponse = user ? { user: true } : { user: false };
        res.status(200).json(JSON.stringify(conditionalResponse));
    }
    if (req.method === 'DELETE') {
        destroyCookie(req, res, 'login');
        res.status(200).json(JSON.stringify({ user: false }));
    }
}

async function onCheckLoginState(browserCookie: string | undefined) {
    if (!browserCookie) return 'internal server error';
    const response = await onValidateHash(browserCookie);
    const conditionalResponse = response ? { user: true } : { user: false };
    return JSON.stringify(conditionalResponse);
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
