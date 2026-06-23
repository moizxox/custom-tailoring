import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "portal_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  return process.env.PORTAL_SESSION_SECRET ?? "lani-portal-dev-secret-change-in-production";
}

function sign(payload: string): string {
  const sig = createHmac("sha256", getSecret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verify(token: string): string | null {
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return null;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = createHmac("sha256", getSecret()).update(payload).digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createPortalSession(customerId: string) {
  const payload = Buffer.from(
    JSON.stringify({ customerId, iat: Date.now() })
  ).toString("base64url");
  const token = sign(payload);

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/kundenbereich",
    maxAge: MAX_AGE,
  });
}

export async function clearPortalSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getPortalCustomerId(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verify(token);
  if (!payload) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      customerId: string;
    };
    return data.customerId ?? null;
  } catch {
    return null;
  }
}

/** For middleware (reads cookie from request) */
export function getCustomerIdFromCookieValue(cookieValue: string | undefined): string | null {
  if (!cookieValue) return null;
  const payload = verify(cookieValue);
  if (!payload) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      customerId: string;
    };
    return data.customerId ?? null;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
