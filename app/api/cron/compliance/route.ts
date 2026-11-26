import { NextResponse } from "next/server";
import { certs, daysLeft, REMINDER_DAYS } from "@/lib/compliance";
import { complianceReminder } from "@/lib/email-templates";
import { sendEmail, splitList } from "@/lib/email";

export const runtime = "nodejs";

/** Runs daily (vercel.json). Vercel sends `Authorization: Bearer $CRON_SECRET`. */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const due = certs.map((c) => ({ ...c, days: daysLeft(c.expires) })).filter((c) => REMINDER_DAYS.includes(c.days) || (c.days < 0 && c.days % 7 === 0));
  if (!due.length) return NextResponse.json({ sent: false, reason: "No reminders due today" });

  const today = new Date().toISOString().slice(0, 10);
  const mail = complianceReminder(due);
  const r = await sendEmail({
    to: splitList(process.env.TENDERS_INBOX_EMAIL || "fuselageresources@outlook.com"),
    cc: splitList(process.env.TENDERS_CC),
    ...mail,
    idempotencyKey: `compliance-${today}`,
    tags: [{ name: "kind", value: "compliance" }],
  });
  return NextResponse.json({ sent: r.ok, count: due.length, ...(r.ok ? { id: r.id } : { error: r.error }) }, { status: r.ok ? 200 : 502 });
}
