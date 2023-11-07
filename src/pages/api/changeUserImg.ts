import { changeUserImgController } from '@/lib/controllers';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    switch (req.method) {
        case 'POST': {
            const response = await changeUserImgController(
                req.body as UserWithImg,
            );
            if (!response.serverResponse) return res.status(500).json(response);
            return res.status(200).json(response);
        }
        default:
            return res.status(405).json({ message: 'Method Not Allowed' });
    }
}

export const config = {
    api: {
        bodyParser: '1mb',
    },
};
