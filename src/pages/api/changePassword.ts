import type { NextApiRequest, NextApiResponse } from 'next';
import { changePasswordController } from '@/lib/controllers';
import { createHash } from '@/lib/hash';
import Cookies from 'cookies';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'POST') {
        const user: ChangePasswordFromClientType = req.body;
        const controllerResponse = await changePasswordController(user);
        if (controllerResponse.serverResponse) {
            const cookies = new Cookies(req, res);
            const userToSetHash = {
                username: { value: user.username.value },
                password: { value: user.newPassword.value },
            };
            const expires = new Date(Date.now() + 1000 * 60 * 60 * 60 * 2);
            const hash = createHash(userToSetHash);
            cookies.set('user-hash', hash, { expires });
        }
        res.status(200).json(controllerResponse);
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
