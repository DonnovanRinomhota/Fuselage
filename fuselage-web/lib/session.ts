import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "sofala_session";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function key() {
  const s = process.env.PORTAL_SESSION_SECRET;
  if (!s || s.length < 16) {
    if (process.env.NODE_ENV === "production") throw new Error("PORTAL_SESSION_SECRET must be set (16+ characters)");
    return new TextEncoder().encode("dev-only-secret-not-for-production");
  }
  return new TextEncoder().encode(s);
}

export type Session = { email: string; name: string; company: string; role: "owner" | "reviewer" | "member" };

export async function createSession(s: Session) {
  return new SignJWT(s).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(`${MAX_AGE}s`).sign(key());
}

export async function readSession(token?: string): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};
