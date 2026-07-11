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

function handleAdmin(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return null;

  // Allow public admin routes and NextAuth API
  if (ADMIN_PUBLIC.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check for NextAuth session token (either __Secure- prefix in prod or authjs. in dev)
  const sessionToken =
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value;

  if (!sessionToken) {
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
