import type { NextApiRequest, NextApiResponse } from 'next';
import { changePasswordController } from '@/lib/controllers';
import { createHash } from '@/lib/hash';
import Cookies from 'cookies';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const cookies = new Cookies(req, res);
    if (req.method === 'POST') {
        const user: UserToChangePasswordFromClientType = req.body;
        const userToSetHash = {
            username: { value: user.username.value },
            password: { value: user.newPassword.value },
        };
        const controllerResponse = await changePasswordController(user);
        if (controllerResponse.serverResponse) {
            const hash = createHash(userToSetHash);
            cookies.set('user-hash', hash);
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
