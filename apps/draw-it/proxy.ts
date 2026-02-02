import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;


  if (
    token &&
    (pathname.startsWith("/signin") ||
    pathname.startsWith("/signup"))
  ) {
    return NextResponse.redirect(new URL("/draw", request.url));
  }

  if (
    !token &&
    pathname.startsWith("/canvas")
  ) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signin/:path*", "/signup/:path*", "/canvas/:path*"],
};
