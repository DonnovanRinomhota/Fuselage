import { company } from "./site";

export const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const siteUrl = () => (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");

const NAVY = "#1b3358";
const WATER = "#1f7ac2";
const GRANITE = "#586474";
const FONT = "Archivo, 'Segoe UI', Arial, sans-serif";

/** Shared, table-based layout that renders in Outlook, Gmail and phone mail apps. */
function layout(opts: { preheader: string; heading: string; body: string; footer?: string; product?: "site" | "sofala" }) {
  const sofala = opts.product === "sofala";
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(opts.heading)}</title></head>
<body style="margin:0;padding:0;background:#f4f7fa;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fa;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;font-family:${FONT};color:#15202e;">
<tr><td style="background:${NAVY};padding:18px 28px;">
  <table role="presentation" width="100%"><tr>
    <td style="color:#ffffff;font-weight:800;font-size:18px;letter-spacing:.02em;">FUSELAGE RESOURCES</td>
    ${sofala ? `<td align="right" style="color:#c3d2e4;font-size:13px;">Sofala tender alerts</td>` : ""}
  </tr></table>
</td></tr>
<tr><td style="padding:28px 28px 8px;">
  <h1 style="margin:0 0 14px;font-size:22px;line-height:1.25;color:${NAVY};">${esc(opts.heading)}</h1>
  ${opts.body}
</td></tr>
<tr><td style="padding:20px 28px 26px;border-top:1px solid #d6dee8;font-size:12.5px;line-height:1.5;color:${GRANITE};">
  ${opts.footer ?? ""}
  ${esc(company.name)} · ${esc(company.address)} · ${esc(company.phones.join(" / "))}
</td></tr>
</table></td></tr></table></body></html>`;
}

const p = (html: string) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.55;">${html}</p>`;
const button = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 18px;"><tr><td style="background:${WATER};border-radius:4px;">
   <a href="${esc(href)}" style="display:inline-block;padding:12px 20px;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;">${esc(label)}</a></td></tr></table>`;
const rows = (pairs: [string, unknown][]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 18px;font-size:14.5px;">${pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:7px 12px 7px 0;color:${GRANITE};vertical-align:top;width:38%;border-bottom:1px solid #eef2f6;">${esc(k)}</td><td style="padding:7px 0;vertical-align:top;border-bottom:1px solid #eef2f6;">${esc(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("")}</table>`;
const list = (items: string[], color = "#15202e") =>
  `<ul style="margin:0 0 16px;padding-left:20px;font-size:14.5px;line-height:1.55;color:${color};">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;

/* ----------------------------------------------------------------------------
 * Website enquiries
 * --------------------------------------------------------------------------*/

export type Enquiry = {
  reference: string;
  type: string;
  typeLabel: string;
  service: string;
  name: string;
  organisation?: string;
  email: string;
  phone: string;
  location?: string;
  neededBy?: string;
  message: string;
  ownerFirst: string;
  ownerRole: string;
};

export function enquiryInternal(e: Enquiry) {
  const subject = `[${e.reference}] ${e.typeLabel}: ${e.service}${e.organisation ? ` for ${e.organisation}` : ""}`;
  const html = layout({
    preheader: `${e.name} sent a request through the website`,
    heading: `New request for ${e.ownerFirst}`,
    body:
      p(`${esc(e.name)}${e.organisation ? ` from <b>${esc(e.organisation)}</b>` : ""} sent a request through the website. Reply to this email to answer them directly.`) +
      rows([
        ["Reference", e.reference],
        ["About", e.typeLabel],
        ["Service", e.service],
        ["Name", e.name],
        ["Organisation", e.organisation],
        ["Email", e.email],
        ["Phone / WhatsApp", e.phone],
        ["Delivery location", e.location],
        ["Needed by", e.neededBy],
      ]) +
      `<div style="background:#f4f7fa;border-left:4px solid ${WATER};padding:14px 16px;margin:0 0 18px;font-size:15px;line-height:1.55;white-space:pre-wrap;">${esc(e.message)}</div>`,
    footer: `Routed to ${esc(e.ownerFirst)} (${esc(e.ownerRole)}) by the website. <br>`,
  });
  const text = `New request ${e.reference} (${e.typeLabel}, ${e.service})\n\nFrom: ${e.name}${e.organisation ? `, ${e.organisation}` : ""}\nEmail: ${e.email}\nPhone: ${e.phone}\nLocation: ${e.location || "-"}\nNeeded by: ${e.neededBy || "-"}\n\n${e.message}\n`;
  return { subject, html, text };
}

export function enquiryAutoReply(e: Enquiry) {
  const subject = `We've received your request (${e.reference})`;
  const html = layout({
    preheader: `Your reference is ${e.reference}. ${e.ownerFirst} will reply.`,
    heading: `Thank you, ${e.name.split(" ")[0]}. Your request is with ${e.ownerFirst}.`,
    body:
      p(`Your reference is <b>${esc(e.reference)}</b>. ${esc(e.ownerFirst)}, our ${esc(e.ownerRole)}, handles ${esc(e.typeLabel.toLowerCase())} requests and will reply to you.`) +
      p(`If you have a bill of quantities, tender document or product list, reply to this email and attach it. Quoting your reference helps us match it to your request.`) +
      rows([
        ["Service", e.service],
        ["Delivery location", e.location],
        ["Needed by", e.neededBy],
      ]) +
      `<p style="margin:0 0 6px;font-size:13px;color:${GRANITE};">Your message</p>` +
      `<div style="background:#f4f7fa;padding:12px 14px;margin:0 0 18px;font-size:14px;line-height:1.5;white-space:pre-wrap;">${esc(e.message)}</div>` +
      p(`Need us sooner? Call ${esc(company.phones.join(" or "))}.`),
    footer: `You're receiving this because you sent a request on our website. <br>`,
  });
  const text = `Thank you, ${e.name}.\n\nYour reference is ${e.reference}. ${e.ownerFirst} (${e.ownerRole}) will reply.\nReply to this email to attach a bill of quantities or tender document.\n\nCall ${company.phones.join(" or ")}.\n\n${company.name}`;
  return { subject, html, text };
}

/* ----------------------------------------------------------------------------
 * Sofala alerts (requirements FR15, FR29, FR30)
 * Every alert says why it was sent and links to the Sofala record.
 * --------------------------------------------------------------------------*/

export type AlertTender = {
  id: string;
  reference: string;
  title: string;
  buyer: string;
  category?: string;
  closes?: string; // ISO date-time
  deliveryTo?: string;
  publishedValue?: string;
  reasons?: string[];
  unknowns?: string[];
};

export type SofalaEvent = "new_match" | "deadline" | "input_needed" | "draft_ready" | "tender_changed" | "failure" | "digest";

export const sofalaEvents: Record<SofalaEvent, { label: string; why: string }> = {
  new_match: { label: "Priority match", why: "This tender meets one of your priority alert rules." },
  deadline: { label: "Closing soon", why: "A tender you shortlisted or are bidding on closes soon." },
  input_needed: { label: "Input needed", why: "Bid preparation is paused until someone supplies the information below." },
  draft_ready: { label: "Draft ready for review", why: "A complete bid draft is ready. Nothing is submitted until an authorised reviewer approves it." },
  tender_changed: { label: "Tender changed", why: "The buyer changed a tender you are tracking. Active bids keep their saved inputs until you review the change." },
  failure: { label: "Action failed", why: "Sofala could not finish a task. The task stays open in the portal." },
  digest: { label: "Daily digest", why: "Your daily summary of new matches. Change frequency or quiet hours in notification settings." },
};

export type SofalaAlert = {
  event: SofalaEvent;
  recipientName?: string;
  tender?: AlertTender;
  tenders?: AlertTender[];
  detail?: string;
  items?: string[];
  link?: string;
};

const fmtDate = (iso?: string) => {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", { timeZone: "Africa/Harare", weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " (Harare)";
};

export function sofalaAlert(a: SofalaAlert) {
  const meta = sofalaEvents[a.event];
  const base = siteUrl();
  const t = a.tender;
  const link = a.link || (t ? `${base}/portal/tenders/${encodeURIComponent(t.id)}` : `${base}/portal`);
  const hello = a.recipientName ? p(`Hi ${esc(a.recipientName)},`) : "";
  const why = `<p style="margin:0 0 16px;font-size:13.5px;color:${GRANITE};"><b style="color:${NAVY};">Why you got this:</b> ${esc(meta.why)}</p>`;

  let heading = meta.label;
  let body = hello;
  let textBody = "";
  let preheader = meta.why;

  const tenderBlock = (x: AlertTender) =>
    rows([
      ["Reference", x.reference],
      ["Buyer", x.buyer],
      ["Category", x.category],
      ["Closes", fmtDate(x.closes)],
      ["Delivery to", x.deliveryTo],
      ["Published value", x.publishedValue],
    ]);

  if (a.event === "digest") {
    const list_ = a.tenders || [];
    heading = `${list_.length} new tender ${list_.length === 1 ? "match" : "matches"} today`;
    preheader = list_.slice(0, 3).map((x) => x.title).join(" · ");
    body +=
      list_
        .map(
          (x) => `<div style="border:1px solid #d6dee8;border-radius:6px;padding:14px 16px;margin:0 0 12px;">
          <a href="${esc(`${base}/portal/tenders/${encodeURIComponent(x.id)}`)}" style="font-weight:700;font-size:15.5px;color:${NAVY};text-decoration:none;">${esc(x.title)}</a>
          <div style="font-size:13.5px;color:${GRANITE};margin-top:4px;">${esc(x.buyer)} · ${esc(x.reference)}${x.closes ? ` · closes ${esc(fmtDate(x.closes))}` : ""}</div>
          ${x.reasons?.length ? `<div style="font-size:13.5px;margin-top:8px;">${esc(x.reasons.join("; "))}</div>` : ""}
          ${x.unknowns?.length ? `<div style="font-size:13px;margin-top:6px;color:#8a6a10;">Not yet known: ${esc(x.unknowns.join(", "))}</div>` : ""}
        </div>`,
        )
        .join("") + button(`${base}/portal/tenders`, "Open all matches in Sofala");
    textBody = list_.map((x) => `- ${x.title} (${x.buyer}, ${x.reference})`).join("\n");
  } else if (t) {
    heading = `${meta.label}: ${t.title}`;
    preheader = `${t.buyer} · ${t.reference}`;
    body += tenderBlock(t);
    if (a.detail) body += p(esc(a.detail));
    if (a.event === "new_match" && t.reasons?.length) body += `<p style="margin:0 0 6px;font-weight:700;font-size:14.5px;">Why it matches</p>` + list(t.reasons);
    if (t.unknowns?.length) body += `<p style="margin:0 0 6px;font-weight:700;font-size:14.5px;color:#8a6a10;">Not confirmed yet</p>` + list(t.unknowns, "#6b5310");
    if (a.items?.length) body += `<p style="margin:0 0 6px;font-weight:700;font-size:14.5px;">${a.event === "input_needed" ? "What we need from you" : a.event === "tender_changed" ? "What changed" : "Details"}</p>` + list(a.items);
    const cta: Record<string, string> = {
      new_match: "Open tender in Sofala",
      deadline: "Open tender in Sofala",
      input_needed: "Add the missing information",
      draft_ready: "Review draft in Sofala",
      tender_changed: "Review the change",
      failure: "Open the task",
    };
    body += button(link, cta[a.event] || "Open in Sofala");
    textBody = `${t.title}\n${t.buyer} · ${t.reference}\nCloses: ${fmtDate(t.closes) || "unknown"}\n${a.detail || ""}\n${(a.items || []).map((i) => `- ${i}`).join("\n")}`;
  } else {
    body += p(esc(a.detail || "")) + (a.items?.length ? list(a.items) : "") + button(link, "Open Sofala");
    textBody = `${a.detail || ""}\n${(a.items || []).map((i) => `- ${i}`).join("\n")}`;
  }

  body += why;

  const html = layout({
    preheader,
    heading,
    body,
    product: "sofala",
    footer: `Sent by Sofala for ${esc(company.name)}. <a href="${esc(base)}/portal/settings" style="color:${WATER};">Manage notifications</a>. Reading this email does not approve a bid or close a task.<br>`,
  });
  const subject = a.event === "digest" ? `Sofala: ${heading}` : `Sofala · ${meta.label}: ${t?.title ?? a.detail ?? ""}`.slice(0, 160);
  const text = `${heading}\n\n${textBody}\n\nOpen in Sofala: ${link}\n\nWhy you got this: ${meta.why}\nManage notifications: ${base}/portal/settings`;
  return { subject, html, text };
}

/* ----------------------------------------------------------------------------
 * Tender uploaded through the portal -> company tenders inbox
 * --------------------------------------------------------------------------*/

export function tenderUploaded(t: {
  id: string; reference: string; title: string; entity: string; category: string; closes: string; timeKnown?: boolean;
  source: string; notes?: string; uploadedBy: string; files: { name: string; kind: string; attached: boolean }[];
}) {
  const base = siteUrl();
  const link = `${base}/portal/tenders/${encodeURIComponent(t.id)}`;
  const closes = t.timeKnown === false ? new Date(t.closes).toLocaleDateString("en-GB", { timeZone: "Africa/Harare", weekday: "short", day: "numeric", month: "short", year: "numeric" }) : fmtDate(t.closes);
  const subject = `Tender uploaded: ${t.reference}: ${t.title}`.slice(0, 160);
  const fileLine = (f: { name: string; kind: string; attached: boolean }) =>
    `${f.name} (${f.kind === "screening" ? "screening" : f.kind === "tender" ? "tender document" : "document"})${f.attached ? "" : ": too large to attach, open in Sofala"}`;
  const html = layout({
    preheader: `${t.entity} · closes ${closes}`,
    heading: `Tender uploaded: ${t.title}`,
    product: "sofala",
    body:
      p(`${esc(t.uploadedBy)} uploaded a tender to Sofala. The documents are attached and saved in the portal.`) +
      rows([
        ["Reference", t.reference],
        ["Procuring entity", t.entity],
        ["Category", t.category],
        ["Closes", closes],
        ["Source", t.source],
        ["Notes", t.notes],
      ]) +
      (t.files.length ? `<p style="margin:0 0 6px;font-weight:700;font-size:14.5px;">Documents</p>` + list(t.files.map(fileLine)) : p("No documents were attached.")) +
      button(link, "Open tender in Sofala") +
      `<p style="margin:0 0 16px;font-size:13.5px;color:${GRANITE};"><b style="color:${NAVY};">Why you got this:</b> This is the company tenders inbox. Every tender uploaded to Sofala is copied here.</p>`,
    footer: `Sent by Sofala for ${esc(company.name)}.<br>`,
  });
  const text = `Tender uploaded by ${t.uploadedBy}\n\n${t.reference}: ${t.title}\n${t.entity}\nCategory: ${t.category}\nCloses: ${closes}\nSource: ${t.source}\n${t.notes ? `Notes: ${t.notes}\n` : ""}\nDocuments:\n${t.files.map((f) => `- ${fileLine(f)}`).join("\n") || "- none"}\n\nOpen in Sofala: ${link}`;
  return { subject, html, text };
}

/* ----------------------------------------------------------------------------
 * Compliance reminder -> tenders inbox
 * --------------------------------------------------------------------------*/
export function complianceReminder(items: { name: string; issuer: string; expires: string; days: number }[]) {
  const base = siteUrl();
  const soonest = Math.min(...items.map((i) => i.days));
  const heading = soonest < 0 ? "Certificates have expired" : soonest === 0 ? "Certificates expire today" : `Certificates expire in ${soonest} day${soonest === 1 ? "" : "s"}`;
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const html = layout({
    preheader: `${items.length} certificate${items.length > 1 ? "s" : ""} to renew`,
    heading,
    product: "sofala",
    body:
      p("An expired certificate fails a bid at the preliminary check. Renew these before submitting any more tenders:") +
      rows(items.map((i) => [`${i.name} (${i.issuer})`, `${fmt(i.expires)}${i.days < 0 ? ", expired" : `, ${i.days} days left`}`] as [string, unknown])) +
      button(`${base}/portal/compliance`, "Open compliance in Sofala") +
      `<p style="margin:0 0 16px;font-size:13.5px;color:${GRANITE};"><b style="color:${NAVY};">Why you got this:</b> Sofala sends reminders 60, 30, 14, 7, 3 and 1 days before a certificate expires.</p>`,
    footer: `Sent by Sofala for ${esc(company.name)}.<br>`,
  });
  const text = `${heading}\n\n${items.map((i) => `- ${i.name} (${i.issuer}): ${fmt(i.expires)}, ${i.days} days left`).join("\n")}\n\nOpen: ${base}/portal/compliance`;
  return { subject: `Sofala: ${heading}`, html, text };
}
