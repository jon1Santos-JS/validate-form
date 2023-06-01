// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';

const ADRESSES = process.env.AUTHORIZED_ADRESSES?.split(', ');
const AUTHORIZED_PAGE_ROUTES = ['/sign-up-page'];

export default async function handler(req: NextRequest) {
    const authorization = { requestURL: req.nextUrl.origin, isValid: false };
    const getValueToTest = { value: '' };
    ADRESSES?.forEach((address) => {
        if (authorization.requestURL === address) authorization.isValid = true;
    });
    console.log();
    ADRESSES?.forEach((address) => {
        AUTHORIZED_PAGE_ROUTES.forEach((route) => {
            if (authorization.requestURL + route === address + route) {
                getValueToTest.value = authorization.requestURL + route;
                authorization.isValid = true;
            }
        });
    });
    if (authorization.isValid) return NextResponse.next();
    return new NextResponse(
        JSON.stringify({
            success: false,
            message: getValueToTest.value + ' - ' + authorization.requestURL,
        }),
        { status: 401, headers: { 'content-type': 'application/json' } },
    );
}

// PROTECTED APIS
export const config = {
    matcher: ['/api/signUp', '/api/handleDB'],
};
