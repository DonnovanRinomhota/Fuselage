import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { sendEmail, isEmail } from "@/lib/email";
import { sofalaAlert, sofalaEvents, type SofalaAlert, type SofalaEvent } from "@/lib/email-templates";

export const runtime = "nodejs";

/**
 * Called by the Sofala agent (n8n workflow or worker) to email alerts.
 *
 * POST /api/sofala/notify
 * Authorization: Bearer <SOFALA_NOTIFY_SECRET>
 * {
 *   "event": "new_match" | "deadline" | "input_needed" | "draft_ready" | "tender_changed" | "failure" | "digest",
 *   "to": ["webster@…"],             // verified recipients only (FR15)
 *   "recipientName": "Webster",
 *   "dedupeKey": "match:CLEANINGMAT/DET/10/26:v2",  // same key = not sent twice (FR29, NFR15)
 *   "tender": { id, reference, title, buyer, category, closes, deliveryTo, publishedValue, reasons[], unknowns[] },
 *   "tenders": [...],                // digest only
 *   "detail": "…", "items": ["…"], "link": "https://…"
 * }
 */
export async function POST(req: Request) {
  const secret = process.env.SOFALA_NOTIFY_SECRET;
  const auth = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!secret || !safeEqual(auth, secret)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as (SofalaAlert & { to?: unknown; dedupeKey?: string }) | null;
  if (!body) return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });

  const problems: string[] = [];
  if (!body.event || !(body.event in sofalaEvents)) problems.push(`event must be one of: ${Object.keys(sofalaEvents).join(", ")}`);
  const to = Array.isArray(body.to) ? body.to.map(String).filter(isEmail) : [];
  if (!to.length) problems.push("to must contain at least one valid email address");
  if (body.event === "digest" && !body.tenders?.length) problems.push("digest needs a non-empty tenders array");
  if (body.event !== "digest" && body.event !== "failure" && !body.tender) problems.push(`${body.event} needs a tender object`);
  if (body.tender && (!body.tender.id || !body.tender.title || !body.tender.reference || !body.tender.buyer))
    problems.push("tender needs id, reference, title and buyer");
  if (problems.length) return NextResponse.json({ error: "invalid payload", problems }, { status: 422 });

  const email = sofalaAlert(body);
  const result = await sendEmail({
    to,
    ...email,
    idempotencyKey: body.dedupeKey ? `sofala-${body.dedupeKey}`.slice(0, 256) : undefined,
    tags: [{ name: "kind", value: "sofala" }, { name: "event", value: body.event as SofalaEvent }],
  });

  // Delivery status is returned so the agent can record it and keep the task visible on failure (FR15).
  if (!result.ok) return NextResponse.json({ status: "failed", error: result.error }, { status: 502 });
  return NextResponse.json({ status: "sent", id: result.id, via: result.via });
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a), bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}
