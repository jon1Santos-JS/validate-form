import { checkUsernameController } from '@/lib/controllers';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    switch (req.method) {
        case 'POST': {
            const username = req.body;
            const controllerResponse = await checkUsernameController(username);
            return res.status(200).json(controllerResponse);
        }
        default: {
            return res.status(403).json({ message: 'Method Not Allowed' });
        }
    }
}
