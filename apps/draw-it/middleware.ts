import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (token && (request.nextUrl.pathname.startsWith('/signin') || request.nextUrl.pathname.startsWith('/signup'))) {
        return NextResponse.redirect(new URL('/draw', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/signin/:path*', '/signup/:path*']
}
