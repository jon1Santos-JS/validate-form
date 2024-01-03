import { checkUsernameController } from '@/controllers/AuthUserController';
import { IncomingMessage } from 'http';
import { NextApiResponse } from 'next';

interface NextApiRequest extends IncomingMessage {
    body: string;
}

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    switch (req.method) {
        case 'POST': {
            const response = await checkUsernameController(req.body);
            return res.status(200).json(response);
        }
        default: {
            return res
                .status(405)
                .json({ success: false, data: 'Method Not Allowed' });
        }
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};
