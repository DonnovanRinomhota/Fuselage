// SAMPLE DATA for the portal preview.
// Tender references and titles come from tenders the Spiritus team screened in #fuselage (Nov 2026).
// Closing dates, values, match reasons and bid states are illustrative until Sofala's PRAZ eGP connection is live.

export type BidState = "new" | "shortlisted" | "input_needed" | "ready_for_review" | "approved" | "closed";

export type Tender = {
  id: string;
  reference: string;
  title: string;
  buyer: string;
  category: string;
  praz?: string;
  kind: "Goods" | "Works" | "Services";
  closes: string; // ISO
  deliveryTo: string | null;
  publishedValue: string | null;
  bidSecurity: string | null;
  state: BidState;
  inProfile: boolean;
  reasons: string[];
  unknowns: string[];
  checklist: { item: string; status: "have" | "missing" | "expires" }[];
  summary: string;
  task?: string;
};

export const sampleTenders: Tender[] = [
  {
    id: "acz-0593b-2026",
    reference: "ACZ-0593B-2026",
    title: "Borehole siting, drilling and capacity test services",
    buyer: "ACZ",
    category: "Borehole drilling",
    kind: "Services",
    closes: "2026-12-04T10:00:00+02:00",
    deliveryTo: null,
    publishedValue: null,
    bidSecurity: null,
    state: "new",
    inProfile: true,
    reasons: ["Borehole drilling is one of your current capabilities", "Closes in more than 7 days, above your minimum preparation time"],
    unknowns: ["Site locations (listed as jmnia 1–14)", "Published value", "Bid security"],
    checklist: [
      { item: "Company profile", status: "have" },
      { item: "PRAZ registration, relevant category", status: "expires" },
      { item: "ZIMRA tax clearance", status: "expires" },
      { item: "NSSA compliance", status: "expires" },
      { item: "Rig and equipment list", status: "missing" },
    ],
    summary: "Siting, drilling and capacity testing across multiple sites. Works and services are discoverable but automated costing is not supported in the first release, so this needs a human assessment.",
  },
  {
    id: "muastapp0099-26",
    reference: "MUASTAPP0099-26",
    title: "Supply and delivery of aggregates",
    buyer: "MUAST",
    category: "Construction materials",
    praz: "GC007",
    kind: "Goods",
    closes: "2026-11-27T10:00:00+02:00",
    deliveryTo: "To confirm from bid document",
    publishedValue: null,
    bidSecurity: null,
    state: "input_needed",
    inProfile: true,
    reasons: ["Construction materials match your profile (PRAZ GC007)", "Goods tender, supported for bid preparation"],
    unknowns: ["Delivery address", "Published value"],
    checklist: [
      { item: "Company profile", status: "have" },
      { item: "PRAZ registration GC007", status: "expires" },
      { item: "ZIMRA tax clearance", status: "expires" },
      { item: "Supplier quote for aggregates", status: "missing" },
      { item: "Transport rate per km", status: "missing" },
    ],
    summary: "Supply of aggregates from the standard bidding document. Preparation is paused until a supplier price and transport rate are entered.",
    task: "Enter a supplier quote for the aggregates and confirm the collection point.",
  },
  {
    id: "coh-s17-2026",
    reference: "COH-S17-2026",
    title: "Framework agreement: supply and delivery of plumbing materials and accessories",
    buyer: "COH",
    category: "Construction materials",
    praz: "GC007",
    kind: "Goods",
    closes: "2026-12-01T10:00:00+02:00",
    deliveryTo: "Harare",
    publishedValue: null,
    bidSecurity: "To confirm",
    state: "ready_for_review",
    inProfile: true,
    reasons: ["Plumbing materials fall under construction materials", "Framework agreement: repeat call-off orders"],
    unknowns: ["Expected call-off volumes"],
    checklist: [
      { item: "Company profile", status: "have" },
      { item: "PRAZ registration GC007", status: "expires" },
      { item: "ZIMRA tax clearance", status: "expires" },
      { item: "NSSA compliance", status: "expires" },
      { item: "Price schedule (draft v1)", status: "have" },
    ],
    summary: "Draft price schedule and checklist are complete. Waiting for an authorised reviewer to approve version 1 before anything is exported for submission.",
    task: "Review draft v1 and approve or request changes.",
  },
  {
    id: "sample-provisions",
    reference: "SAMPLE-PROV-01",
    title: "Supply of groceries and provisions to a hospital kitchen",
    buyer: "Sample buyer",
    category: "Groceries & provisions",
    praz: "GG003",
    kind: "Goods",
    closes: "2026-12-08T10:00:00+02:00",
    deliveryTo: "Bulawayo",
    publishedValue: "USD 2,000 (illustrative)",
    bidSecurity: "None",
    state: "shortlisted",
    inProfile: true,
    reasons: ["Groceries and provisions match your profile (PRAZ GG003)", "Similar to your recent Mpilo Central Hospital order"],
    unknowns: [],
    checklist: [
      { item: "Company profile", status: "have" },
      { item: "PRAZ registration GG003", status: "expires" },
      { item: "Product price list", status: "missing" },
    ],
    summary: "Illustrative example of a provisions tender for the preview.",
  },
  {
    id: "norton-cleaningmat-10-26",
    reference: "CLEANINGMAT/DET/10/26",
    title: "Framework agreement: cleaning materials and detergents (37 items)",
    buyer: "Norton Town Council",
    category: "Cleaning materials",
    kind: "Goods",
    closes: "2026-11-19T10:00:00+02:00",
    deliveryTo: "Norton Town Council offices",
    publishedValue: null,
    bidSecurity: "None",
    state: "closed",
    inProfile: false,
    reasons: ["Found by searching outside your categories", "Delivery in Norton, your home town"],
    unknowns: [],
    checklist: [
      { item: "USD 150 SPOC fee receipt", status: "missing" },
      { item: "3 trade reference letters in cleaning supplies", status: "missing" },
      { item: "Stock status sheet", status: "missing" },
    ],
    summary: "Closed 19 Nov 2026, 10:00. Cleaning materials are outside the current profile, so this was an exploration result, not a recommendation.",
  },
];

export const stateLabel: Record<BidState, string> = {
  new: "New match",
  shortlisted: "Shortlisted",
  input_needed: "Input needed",
  ready_for_review: "Ready for review",
  approved: "Approved",
  closed: "Closed",
};

export const sampleInbox = [
  { id: 1, unread: true, when: "Today, 08:00", title: "Draft ready for review: COH-S17-2026", body: "Price schedule v1 and the document checklist are complete.", href: "/portal/tenders/coh-s17-2026" },
  { id: 2, unread: true, when: "Today, 07:10", title: "Input needed: MUASTAPP0099-26", body: "Add a supplier quote for aggregates so the bid can be costed.", href: "/portal/tenders/muastapp0099-26" },
  { id: 3, unread: false, when: "Yesterday, 17:00", title: "Daily digest: 2 new matches", body: "ACZ-0593B-2026 and SAMPLE-PROV-01.", href: "/portal/tenders" },
  { id: 4, unread: false, when: "Mon, 09:00", title: "Certificates expire 31 Dec 2026", body: "All 5 PRAZ categories, ZIMRA tax clearance and NSSA need renewing.", href: "/portal/settings" },
];

export function closesIn(iso: string, now = new Date()) {
  const ms = new Date(iso).getTime() - now.getTime();
  if (ms <= 0) return { label: "Closed", urgent: false, past: true };
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  return { label: days > 0 ? `${days}d ${hours}h left` : `${hours}h left`, urgent: days < 3, past: false };
}

export function fmtClose(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { timeZone: "Africa/Harare", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
