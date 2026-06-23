import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "portal_session";

const PUBLIC_PATHS = ["/kundenbereich/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/kundenbereich")) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/kundenbereich/api") ||
    pathname.startsWith("/kundenbereich/massblatt/") ||
    PUBLIC_PATHS.some((p) => pathname === p)
  ) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get(COOKIE_NAME)?.value);

  if (!hasSession) {
    const login = new URL("/kundenbereich/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/kundenbereich/:path*"],
};
