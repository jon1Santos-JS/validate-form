// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

const AUTHORIZED_ADRESSES =
    process.env.AUTHORIZED_ADRESSES_TO_REQUEST_APIS?.split(', ');
const ADRESSES_ROUTES = ['/sign-up-page'];

export default async function handler(req: NextApiRequest) {
    console.log(req.headers);
    AUTHORIZED_ADRESSES?.forEach((address) => {
        if (req.headers.referer === address) return NextResponse.next();
        ADRESSES_ROUTES.forEach((route) => {
            if (req.headers.referer === address + route)
                return NextResponse.next();
            return;
        });
        return;
    });
    return new NextResponse(
        JSON.stringify({ success: false, message: 'authentication failed' }),
        { status: 401, headers: { 'content-type': 'application/json' } },
    );
}

export const config = {
    matcher: ['/api/signUp', '/api/handleDB'],
};
