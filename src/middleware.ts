import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: '/api/:function*',
};

export function middleware(req: NextRequest) {
    if (!process.env.IS_LOCALHOST) {
        switch (req.nextUrl.origin) {
            case 'https://validate-form-refactoring-git-main-gupa581333-gmailcom.vercel.app':
                return NextResponse.next();
            case 'https://validating-form.vercel.app':
                return NextResponse.next();
            case 'https://validate-form-refactoring-7opgn27mm-gupa581333-gmailcom.vercel.app':
                return NextResponse.next();
            case 'http://localhost:3000':
                return NextResponse.next();
            default:
                return NextResponse.json(
                    { success: false, data: 'authentication failed' },
                    { status: 401 },
                );
        }
    }
}
