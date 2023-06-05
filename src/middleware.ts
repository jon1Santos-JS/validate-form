// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';

const ADRESSES = process.env.AUTHORIZED_ADRESSES?.split(', ');
const AUTHORIZED_PAGE_ROUTES = [
    '/sign-up-page',
    '/sign-in-page',
    '/dashboard-page',
];

export default async function handler(req: NextRequest) {
    const authorization = { requestURL: req.nextUrl.origin, isValid: false };
    const getValueToTest = { value: '' };
    const anotherValueToTest = { value: '' };
    ADRESSES?.forEach((address) => {
        if (`${authorization.requestURL}` === `${address}`)
            authorization.isValid = true;
    });
    ADRESSES?.forEach((address) => {
        AUTHORIZED_PAGE_ROUTES.forEach((route) => {
            getValueToTest.value = authorization.requestURL + route;
            anotherValueToTest.value = address + route;
            route.replace("'", '');
            address.replace("'", '');
            if (authorization.requestURL + route === address + route) {
                authorization.isValid = true;
            }
        });
    });
    if (authorization.isValid) return NextResponse.next();
    return new NextResponse(
        JSON.stringify({
            success: false,
            message: 'Not authenticated',
        }),
        { status: 401, headers: { 'content-type': 'application/json' } },
    );
}

// PROTECTED APIS
export const config = {
    matcher: ['/api/signUp', '/api/handleDB', '/api/signIn'],
};
