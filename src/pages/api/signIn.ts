// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { createHash, onValidateHash } from '@/lib/hash';
import { getUserStateController, signInController } from '@/lib/controllers';
import Cookies from 'cookies';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const cookies = new Cookies(req, res);
    if (req.method === 'GET') {
        const browserHash = cookies.get('user-hash');
        if (!browserHash) {
            res.status(200).json({ serverResponse: false });
            return;
        }
        const controllerResponse = await getUserStateController();
        // IF THERE'S NO DATABASE USERS, IT'LL COMPARE ADMIN'S ACCOUNT TO HASH
        if (!controllerResponse.serverResponse) {
            const admins = [
                {
                    username: { value: process.env.ADMIN_USERNAME as string },
                    password: { value: process.env.ADMIN_PASSWORD as string },
                },
            ];

            const validatedHash = await onValidateHash(browserHash, admins);
            res.status(200).json({
                serverResponse: validatedHash,
            });
            return;
        }
        const DBusers = controllerResponse.serverResponse;
        const validatedHash = await onValidateHash(browserHash, DBusers);
        res.status(200).json({
            serverResponse: validatedHash,
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
