import Link from "next/link";
import { enquiryAutoReply, enquiryInternal, sofalaAlert, sofalaEvents, tenderUploaded, type Enquiry, type SofalaEvent } from "@/lib/email-templates";
import { sampleTenders } from "@/lib/sofala-sample";

export const metadata = { title: "Email previews" };

const sampleEnquiry: Enquiry = {
  reference: "FR-261125-7KQ2", type: "quote", typeLabel: "Quotation", service: "Construction materials",
  name: "Tendai Moyo", organisation: "Chegutu Rural District Council", email: "procurement@example.org", phone: "+263 77 000 0000",
  location: "Chegutu", neededBy: "2026-12-10",
  message: "Please quote for 400 bags of cement (32.5N) and 20 cubic metres of river sand delivered to our Chegutu depot.",
  ownerFirst: "Darleen", ownerRole: "Sales & Marketing Director",
};

function build(key: string) {
  const byId = (id: string) => sampleTenders.find((t) => t.id === id)!;
  const [a, b, c, d] = [byId("coh-s17-2026"), byId("muastapp0099-26"), byId("umz-gds-16-2026"), byId("npa-groc-prov-2-26")];
  const toT = (t: typeof a) => ({ id: t.id, reference: t.reference, title: t.title, buyer: t.buyer, category: t.category, closes: t.closes, deliveryTo: t.deliveryTo ?? undefined, publishedValue: t.publishedValue ?? undefined, reasons: t.reasons, unknowns: t.unknowns });
  switch (key as SofalaEvent | "enquiry-team" | "enquiry-reply" | "tender-upload") {
    case "enquiry-team": return enquiryInternal(sampleEnquiry);
    case "enquiry-reply": return enquiryAutoReply(sampleEnquiry);
    case "tender-upload": return tenderUploaded({ ...c, uploadedBy: "Webster Chinyoka", source: "PRAZ e-GP (uploaded)", notes: "Cement and culverts, both our lines. Please price.", files: [{ name: "UMZ-GDS-16-2026_Bid_Document.pdf", kind: "tender", attached: true }, { name: "UMZ-GDS-16-2026_Screening.pdf", kind: "screening", attached: true }] });
    case "digest": return sofalaAlert({ event: "digest", recipientName: "Webster", tenders: [toT(c), toT(d), toT(byId("motid-opex-agt1-2026"))] });
    case "input_needed": return sofalaAlert({ event: "input_needed", recipientName: "Webster", tender: toT(b), items: ["Quarry price per m³: sand, 19mm and 13.2mm stone", "Haulage rate to Marondera Campus", "Technical literature for each item"] });
    case "draft_ready": return sofalaAlert({ event: "draft_ready", recipientName: "Webster", tender: toT(a), detail: "Price schedule v1 for lots 6–12 (PVC and GMS) and the document checklist are complete." });
    case "deadline": return sofalaAlert({ event: "deadline", recipientName: "Webster", tender: toT(b), detail: "This bid is still waiting for input and closes in under 48 hours." });
    case "tender_changed": return sofalaAlert({ event: "tender_changed", recipientName: "Webster", tender: toT(a), items: ["Example: closing date moved from 2 Dec to 4 Dec 2026", "Example: addendum 1 added to the bid document"] });
    case "failure": return sofalaAlert({ event: "failure", recipientName: "Webster", detail: "PRAZ eGP didn't respond at the 09:00 check. Sofala will retry at 10:00.", items: ["No tenders were missed; the next check covers the gap"] });
    default: return sofalaAlert({ event: "new_match", recipientName: "Webster", tender: toT(c) });
  }
}

const tabs = [
  { key: "enquiry-team", label: "Website enquiry: to team" },
  { key: "enquiry-reply", label: "Website enquiry: auto-reply" },
  { key: "tender-upload", label: "Tender uploaded: to tenders inbox" },
  ...Object.entries(sofalaEvents).map(([k, v]) => ({ key: k, label: `Sofala: ${v.label}` })),
];

export default async function Emails({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const key = (await searchParams).t || "enquiry-team";
  const email = build(key);
  return (
    <>
      <h1>Email previews</h1>
      <p className="muted" style={{ marginTop: ".4rem" }}>The automatic emails the website and Sofala send, with sample content.</p>
      <nav className="tabs" aria-label="Email">
        {tabs.map((t) => <Link key={t.key} href={`/portal/emails?t=${t.key}`} aria-current={t.key === key ? "page" : undefined}>{t.label}</Link>)}
      </nav>
      <p className="small"><b>Subject:</b> {email.subject}</p>
      <iframe className="email-frame" title={`Preview: ${email.subject}`} srcDoc={email.html} sandbox="" />
    </>
  );
}
