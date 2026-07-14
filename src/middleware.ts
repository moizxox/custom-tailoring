import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Customer portal — HMAC cookie guard
// ─────────────────────────────────────────────────────────────────────────────

const PORTAL_COOKIE = "portal_session";
const PORTAL_PUBLIC = [
  "/kundenbereich/login",
  "/kundenbereich/register",
];

function handlePortal(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/kundenbereich")) return null;

  if (
    pathname.startsWith("/kundenbereich/api") ||
    pathname.startsWith("/kundenbereich/massblatt/") ||
    pathname.startsWith("/kundenbereich/zugang/") ||
    pathname.startsWith("/kundenbereich/verify/") ||
    PORTAL_PUBLIC.some((p) => pathname === p)
  ) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get(PORTAL_COOKIE)?.value);
  if (!hasSession) {
    const login = new URL("/kundenbereich/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin CMS — NextAuth JWT cookie guard
// ─────────────────────────────────────────────────────────────────────────────

const ADMIN_PUBLIC = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
  "/admin/api/auth",
];

/** Auth.js may store the JWT as a single cookie or chunked `.0` / `.1` pieces. */
function hasAdminSessionCookie(request: NextRequest): boolean {
  for (const { name } of request.cookies.getAll()) {
    if (
      name === "authjs.session-token" ||
      name === "__Secure-authjs.session-token" ||
      name === "next-auth.session-token" ||
      name === "__Secure-next-auth.session-token" ||
      name.startsWith("authjs.session-token.") ||
      name.startsWith("__Secure-authjs.session-token.") ||
      name.startsWith("next-auth.session-token.") ||
      name.startsWith("__Secure-next-auth.session-token.")
    ) {
      return true;
    }
  }
  return false;
}

function handleAdmin(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return null;

  // Allow public admin routes and NextAuth API
  if (ADMIN_PUBLIC.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (!hasAdminSessionCookie(request)) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

// ─────────────────────────────────────────────────────────────────────────────
// Combined middleware
// ─────────────────────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const portalResult = handlePortal(request);
  if (portalResult) return portalResult;

  const adminResult = handleAdmin(request);
  if (adminResult) return adminResult;

  return NextResponse.next();
}

export const config = {
  matcher: ["/kundenbereich/:path*", "/admin/:path*"],
};
