import { NextResponse } from "next/server";
import { sendEmail, splitList, isEmail } from "@/lib/email";
import { enquiryAutoReply, enquiryInternal, type Enquiry } from "@/lib/email-templates";
import { divisions, enquiryTypes, team } from "@/lib/site";

export const runtime = "nodejs";

const ROUTES: Record<string, string | undefined> = {
  webster: process.env.TENDERS_INBOX_EMAIL || process.env.ROUTE_TENDERS_EMAIL,
  darleen: process.env.ROUTE_QUOTES_EMAIL,
  janet: process.env.ROUTE_ORDERS_EMAIL,
};
const FALLBACK = "fuselageresources@outlook.com";

// Light per-instance throttle. Swap for Vercel firewall rate limiting in production.
const hits = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const clean = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ errors: { form: "The request was empty. Fill in the form and send it again." } }, { status: 400 });

  // Honeypot: bots fill hidden fields. Pretend success so they don't retry.
  if (clean(body.website)) return NextResponse.json({ reference: "FR-000000-0000" });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (throttled(ip)) {
    return NextResponse.json({ errors: { form: "Too many requests from this connection. Wait ten minutes, or call us." } }, { status: 429 });
  }

  const typeDef = enquiryTypes.find((t) => t.value === body.type) ?? enquiryTypes[0];
  const division = divisions.find((d) => d.slug === body.service);
  const owner = team[typeDef.owner];

  const e: Enquiry = {
    reference: makeReference(),
    type: typeDef.value,
    typeLabel: typeDef.label.replace(/^(A|An) /, "").replace(/^./, (c) => c.toUpperCase()),
    service: division?.short ?? "Something else",
    name: clean(body.name, 120),
    organisation: clean(body.organisation, 160) || undefined,
    email: clean(body.email, 200).toLowerCase(),
    phone: clean(body.phone, 40),
    location: clean(body.location, 200) || undefined,
    neededBy: clean(body.needed_by, 20) || undefined,
    message: clean(body.message, 5000),
    ownerFirst: owner.first,
    ownerRole: owner.role,
  };

  const errors: Record<string, string> = {};
  if (!e.name) errors.name = "Enter your name.";
  if (!isEmail(e.email)) errors.email = "Enter an email address like name@example.com.";
  if (e.phone.replace(/\D/g, "").length < 9) errors.phone = "Enter a phone or WhatsApp number, including the area code.";
  if (e.message.length < 10) errors.message = "Describe what you need: items, quantities, or the tender number.";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  const routeTo = ROUTES[typeDef.owner] || FALLBACK;
  const internal = enquiryInternal(e);
  const reply = enquiryAutoReply(e);

  const [toTeam, toCustomer] = await Promise.all([
    sendEmail({
      to: [routeTo],
      cc: splitList(process.env.ENQUIRY_CC),
      replyTo: e.email,
      ...internal,
      idempotencyKey: `enquiry-team-${e.reference}`,
      tags: [{ name: "kind", value: "enquiry" }, { name: "type", value: e.type }],
    }),
    sendEmail({
      to: [e.email],
      replyTo: routeTo,
      ...reply,
      idempotencyKey: `enquiry-ack-${e.reference}`,
      tags: [{ name: "kind", value: "enquiry-ack" }],
    }),
  ]);

  if (!toTeam.ok) {
    console.error("[enquiry] team email failed", e.reference, toTeam.error);
    return NextResponse.json(
      { errors: { form: "Your request couldn't be delivered to our team. Call +263 773 239 084 or email fuselageresources@outlook.com." } },
      { status: 502 },
    );
  }
  if (!toCustomer.ok) console.warn("[enquiry] auto-reply failed", e.reference, toCustomer.error);

  return NextResponse.json({ reference: e.reference, routedTo: owner.first });
}

function makeReference() {
  const d = new Date();
  const ymd = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FR-${ymd}-${rand}`;
}
