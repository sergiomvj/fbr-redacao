import { NextResponse } from 'next/headers';
import type { NextRequest } from 'next/server';
import { decryptSession } from '@/lib/session';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/redacao')) {
        const sessionCookie = request.cookies.get('fbr_redacao_session');

        if (!sessionCookie?.value) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const sessionData = await decryptSession(sessionCookie.value);

        if (!sessionData.isLoggedIn) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
