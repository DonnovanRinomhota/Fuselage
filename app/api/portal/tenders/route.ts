import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { sessionFromRequest } from "@/lib/api-session";
import { sendEmail, splitList } from "@/lib/email";
import { tenderUploaded } from "@/lib/email-templates";
import { FILES_PREFIX, readFile, saveTender } from "@/lib/store";
import type { Tender, TenderDoc } from "@/lib/sofala-sample";

export const runtime = "nodejs";
export const maxDuration = 60;

const CATEGORIES = ["Construction materials", "Borehole drilling", "Butchery & meat", "Fruit & vegetables", "Groceries & provisions", "Other"];
const SOURCES = ["PRAZ e-GP", "Government Gazette", "Newspaper", "Sent by buyer", "Other"];
const ATTACH_LIMIT = 28 * 1024 * 1024; // keep base64 email under Resend's 40 MB

type Body = {
  reference?: string; title?: string; entity?: string; category?: string; closesDate?: string; closesTime?: string;
  source?: string; notes?: string;
  files?: { pathname: string; name: string; size: number; kind: "tender" | "screening" }[];
};

const clean = (v: unknown, max = 300) => String(v ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  const session = await sessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Your session ended. Sign in again, then upload." }, { status: 401 });

  const b = (await req.json().catch(() => null)) as Body | null;
  if (!b) return NextResponse.json({ error: "Nothing was received. Fill in the form and try again." }, { status: 400 });

  const reference = clean(b.reference, 80);
  const title = clean(b.title, 200);
  const entity = clean(b.entity, 160);
  const category = CATEGORIES.includes(String(b.category)) ? String(b.category) : "Other";
  const source = SOURCES.includes(String(b.source)) ? String(b.source) : "Other";
  const date = clean(b.closesDate, 10);
  const time = clean(b.closesTime, 5);
  const files = (b.files || []).filter((f) => typeof f?.pathname === "string" && f.pathname.startsWith(FILES_PREFIX)).slice(0, 10);

  const errors: Record<string, string> = {};
  if (!reference) errors.reference = "Enter the tender reference number.";
  if (!title) errors.title = "Enter the tender title.";
  if (!entity) errors.entity = "Enter the procuring entity.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.closesDate = "Enter the closing date.";
  if (time && !/^\d{2}:\d{2}$/.test(time)) errors.closesTime = "Enter the time as HH:MM.";
  if (!files.some((f) => f.kind === "tender") && !files.some((f) => f.kind === "screening")) errors.files = "Attach the tender document, a screening document, or both.";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  const id = `${reference.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50)}-${randomUUID().slice(0, 4)}`;
  const closes = `${date}T${time || "00:00"}:00+02:00`;
  const docs: TenderDoc[] = files.map((f) => ({ name: f.name, kind: f.kind, size: f.size, href: `/api/portal/files?p=${encodeURIComponent(f.pathname)}` }));

  const tender: Tender = {
    id, reference, title, buyer: entity.split("(")[0].trim().slice(0, 40), entity, category,
    kind: "Goods", closes, timeKnown: Boolean(time), deliveryTo: null, publishedValue: null, bidSecurity: null,
    state: "new", inProfile: category !== "Other",
    reasons: [`Uploaded by ${session.name}`], unknowns: [], checklist: [],
    summary: clean(b.notes, 1000) || "Uploaded to Sofala. Screening details will appear here once added.",
    source: `${source} (uploaded)`, docs, uploadedBy: session.name, uploadedAt: new Date().toISOString(), notes: clean(b.notes, 1000) || undefined,
  };

  await saveTender(tender);

  // Email the company tenders inbox with the documents attached.
  let total = 0;
  const attachments: { filename: string; content: string }[] = [];
  const fileSummary: { name: string; kind: string; attached: boolean }[] = [];
  for (const f of files) {
    const got = total + f.size <= ATTACH_LIMIT ? await readFile(f.pathname) : null;
    if (got) {
      total += got.data.length;
      attachments.push({ filename: f.name, content: got.data.toString("base64") });
    }
    fileSummary.push({ name: f.name, kind: f.kind, attached: !!got });
  }

  const to = splitList(process.env.TENDERS_INBOX_EMAIL || process.env.ROUTE_TENDERS_EMAIL || "fuselageresources@outlook.com");
  const mail = tenderUploaded({ ...tender, uploadedBy: session.name, files: fileSummary });
  const sent = await sendEmail({
    to,
    cc: splitList(process.env.TENDERS_CC),
    ...mail,
    attachments,
    idempotencyKey: `tender-upload-${id}`,
    tags: [{ name: "kind", value: "tender-upload" }],
  });
  if (!sent.ok) console.error("[tenders] inbox email failed", id, sent.error);

  return NextResponse.json({ id, emailed: sent.ok ? to : [], emailError: sent.ok ? undefined : "The tender was saved, but the email to the tenders inbox didn't send. It's still in Sofala." });
}
