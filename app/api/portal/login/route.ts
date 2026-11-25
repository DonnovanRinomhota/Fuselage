import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { createSession, cookieOptions, SESSION_COOKIE } from "@/lib/session";

export const runtime = "nodejs";

/**
 * Preview sign-in. Until Sofala has its own accounts (FR25), one preview login is configured in env.
 * Replace this handler with the Sofala auth provider when it exists.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const next = String(form.get("next") || "/portal");
  const safeNext = next.startsWith("/portal") && !next.startsWith("//") ? next : "/portal";

  const okEmail = (process.env.PORTAL_DEMO_EMAIL || "demo@fuselage.co.zw").toLowerCase();
  const okPass = process.env.PORTAL_DEMO_PASSWORD || "sofala-preview";

  const base = new URL(req.url);
  if (email !== okEmail || !same(password, okPass)) {
    const url = new URL("/portal/login", base);
    url.searchParams.set("error", "1");
    if (safeNext !== "/portal") url.searchParams.set("next", safeNext);
    return NextResponse.redirect(url, 303);
  }

  const token = await createSession({ email, name: "Webster Chinyoka", company: "Fuselage Resources", role: "owner" });
  const res = NextResponse.redirect(new URL(safeNext, base), 303);
  res.cookies.set(SESSION_COOKIE, token, cookieOptions);
  return res;
}

function same(a: string, b: string) {
  const ab = Buffer.from(a), bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}
