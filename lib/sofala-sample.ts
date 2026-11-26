// REAL TENDERS used as the portal's demo data (Nov 2026).
// - "Screened": tenders the Spiritus team screened from PRAZ e-GP documents on 21 Nov 2026 (+ Norton, 17 Nov).
// - "Gazette": open tenders in Fuselage's categories from the Zimbabwe Government Gazette, 13 Nov 2026.
// Tender facts (entity, reference, title, closing date, scope) are real. Bid progress (state, tasks) is a demo.

export type BidState = "new" | "shortlisted" | "input_needed" | "ready_for_review" | "approved" | "closed";

export type TenderDoc = { name: string; href: string; kind: "tender" | "screening" | "other"; size?: number };

export type Screening = {
  screenedOn: string;
  what: string;
  contract: string;
  pricing: string;
  howPick: string;
  terms: string;
  table?: { head: string[]; rows: string[][] };
};

export type Recommendation = { decision: "bid" | "no-bid" | "review"; reason: string };

export type Tender = {
  id: string;
  reference: string;
  title: string;
  buyer: string; // short name
  entity: string; // full procuring entity name
  category: string;
  praz?: string;
  kind: "Goods" | "Works" | "Services";
  closes: string; // ISO
  timeKnown?: boolean; // false when the source gives a date only
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
  source: string;
  screening?: Screening;
  docs: TenderDoc[];
  uploadedBy?: string;
  uploadedAt?: string;
  notes?: string;
  /** Spiritus bid / no-bid recommendation (proposal: "every relevant tender ... with a bid or no-bid recommendation"). */
  recommendation?: Recommendation;
  /** Date Spiritus identified and screened it (YYYY-MM-DD). Drives the USD 2.50 screening fee. Absent for staff uploads. */
  screenedOn?: string;
};

const certs = (codes: string[]): Tender["checklist"] => [
  { item: "Company profile", status: "have" },
  ...codes.map((c) => ({ item: `PRAZ registration ${c}`, status: "expires" as const })),
  { item: "ZIMRA tax clearance", status: "expires" },
  { item: "NSSA compliance", status: "expires" },
];

const GAZETTE = "Government Gazette, 13 Nov 2026 (tender on e-GP)";

export const sampleTenders: Tender[] = [
  // ---------------- Screened by the team ----------------
  {
    id: "coh-s17-2026",
    recommendation: { decision: "bid", reason: "Strong fit: framework with repeat call-offs. Bid lots 6–12 (PVC and GMS) where local stock is reliable; skip brass and copper lots without manufacturer letters." },
    screenedOn: "2026-11-21",
    reference: "COH/S.17/2026",
    title: "Framework agreement: supply and delivery of plumbing materials and accessories",
    buyer: "City of Harare",
    entity: "City of Harare (Central Stores, 2 Coventry Road, Workington)",
    category: "Construction materials",
    praz: "GC007",
    kind: "Goods",
    closes: "2026-12-02T14:30:00+02:00",
    deliveryTo: "DDP Harare (Central Stores, Workington)",
    publishedValue: "Not published",
    bidSecurity: "None. USD 150 admin fee; ~10% performance security at call-off",
    state: "ready_for_review",
    inProfile: true,
    reasons: ["Plumbing materials fall under construction materials (GC007)", "3-year framework with repeat call-off orders", "Harare delivery is within reach of Norton"],
    unknowns: ["Manufacturer authorisations for brass and copper lines", "Call-off volumes (none guaranteed)"],
    checklist: [...certs(["GC007"]), { item: "Price schedule, lots 6–12 (draft v1)", status: "have" }, { item: "Manufacturer authorisation letters", status: "missing" }],
    summary: "20 lots, 187 line items. Panel of 3–10 suppliers per item; call-offs by mini-competition. Quote every line in each lot you bid, or the highest competitor price is assigned.",
    task: "Review draft price schedule v1 (lots 6–12, PVC and GMS) and approve or request changes.",
    source: "Screened by Spiritus from the e-GP bid document, 21 Nov 2026",
    screening: {
      screenedOn: "21 Nov 2026",
      what: "Supply and delivery of plumbing materials and accessories: brass valves and taps, copper fittings, PVC and poly pipe and fittings, galvanised (GMS) fittings, sanitaryware, rubber traps and connectors, jointing consumables. 20 lots, 187 line items, most with a 2-week delivery period.",
      contract: "Framework agreement, 3 years (extendable by 2). Panel of 3 to 10 suppliers per item. Call-offs by mini-competition (RFQ). No guaranteed volumes.",
      pricing: "No budget or ceiling published. DDP Harare unit price per item in USD, paid in ZiG at RBZ mid-rate, up to 60 days after invoice. Call-off quotes can't exceed the framework base price. Assume prices fixed for 3 years.",
      howPick: "Pass/fail preliminary check, technical compliance, then lowest evaluated price per item. No points, no preference margin.",
      terms: "Bid valid 90 days; USD 150 admin fee; no bid security; ~10% performance security at call-off; minimum 18 months shelf life; manufacturer authorisation and local after-sales rep required.",
      table: {
        head: ["Heaviest lines (3-year totals)", "Quantity"],
        rows: [["20mm and 25mm GMS barrel nipples", "3,000 each"], ["Thread seal tape", "2,000"], ["50mm PVC plain bend waste", "2,000"], ["50mm PVC centre threaded tee", "2,000"], ["Solvent cement 500ml", "1,500"]],
      },
    },
    docs: [{ name: "COH-S17-2026_Tender_Screening.pdf", href: "/api/portal/files?doc=COH-S17-2026_Tender_Screening.pdf", kind: "screening" }],
  },
  {
    id: "muastapp0099-26",
    recommendation: { decision: "bid", reason: "Core product, clear quantities (1,700 m³) and no bid security. Bid if quarry and haulage prices are confirmed by 2 Dec." },
    screenedOn: "2026-11-21",
    reference: "MUASTAPP0099/26",
    title: "Procurement of aggregates: quarry sand and quarry stone",
    buyer: "MUAST",
    entity: "Marondera University of Agricultural Sciences and Technology (MUAST)",
    category: "Construction materials",
    praz: "GC007",
    kind: "Goods",
    closes: "2026-12-04T10:00:00+02:00",
    deliveryTo: "Marondera Campus (supply, deliver and offload)",
    publishedValue: "Not published",
    bidSecurity: "Bid securing declaration",
    state: "input_needed",
    inProfile: true,
    reasons: ["Aggregates are construction materials (GC007), a core Fuselage line", "Marondera is about 110 km from Norton"],
    unknowns: ["Page 2 of the document shows MUASTAPP0080/26: confirm the reference on e-GP"],
    checklist: [...certs(["GC007"]), { item: "Quarry price per m³ (sand, 19mm, 13.2mm)", status: "missing" }, { item: "Haulage rate Norton/quarry → Marondera", status: "missing" }, { item: "Technical literature for each item", status: "missing" }],
    summary: "1,700 m³ in total across 3 items, delivered within 7 days of signing. Quote a USD unit price per m³ including supply, delivery and offloading.",
    task: "Add quarry prices for the 3 items and a haulage rate to Marondera so the bid can be costed.",
    source: "Screened by Spiritus from the e-GP bid document, 21 Nov 2026",
    screening: {
      screenedOn: "21 Nov 2026",
      what: "Supply, delivery and offloading of quarry sand and quarry stone to Marondera Campus. 3 items, 1,700 m³ in total.",
      contract: "Single supply contract. Delivery within 7 days of contract signing.",
      pricing: "No budget or price ceiling published. USD unit price per m³ for each item, inclusive of supply, delivery and offloading. Fixed and firm for the bid validity period.",
      howPick: "Pass/fail preliminary check, technical compliance (specification sheet column c plus technical literature, or rejected), then lowest evaluated price. A late delivery offer is non-responsive. Supplier due diligence before award.",
      terms: "Bid valid 60 days; bid securing declaration required; no fee or performance security stated. e-GP only. Clarifications closed 21 Nov 2026, 15:00.",
      table: { head: ["Item", "Description", "Quantity"], rows: [["1", "Quarry sand", "780 m³"], ["2", "19mm quarry stones", "880 m³"], ["3", "13.2mm quarry stones", "40 m³"]] },
    },
    docs: [{ name: "MUASTAPP0099-26_Tender_Screening.pdf", href: "/api/portal/files?doc=MUASTAPP0099-26_Tender_Screening.pdf", kind: "screening" }],
  },
  {
    id: "acz-0593b-2026",
    recommendation: { decision: "no-bid", reason: "Closed 17 Nov, and the compulsory site visit (29 Oct) was missed. Requires PRAZ SB003." },
    screenedOn: "2026-11-21",
    reference: "ACZ/0593B/2026",
    title: "Borehole siting, drilling and capacity tests, JMNIA Bulawayo",
    buyer: "ACZ",
    entity: "Airports Company of Zimbabwe (ACZ)",
    category: "Borehole drilling",
    praz: "SB003",
    kind: "Works",
    closes: "2026-11-17T10:00:00+02:00",
    deliveryTo: "Joshua Mqabuko Nkomo International Airport, Bulawayo",
    publishedValue: "Not published",
    bidSecurity: "Bid securing declaration",
    state: "closed",
    inProfile: true,
    reasons: ["Borehole drilling is a Fuselage division"],
    unknowns: ["Whether Fuselage holds PRAZ SB003", "Pages 15–28 (bill of quantities) missing from the copy received", "Possible extension: check e-GP"],
    checklist: [{ item: "PRAZ registration SB003", status: "missing" }, { item: "Site visit certificate (29 Oct 2026)", status: "missing" }, { item: "3 client references, borehole work in last 5 years", status: "missing" }],
    summary: "Closed 17 Nov 2026 before screening. 3 boreholes, wet-hole contract (min. 1.2 l/s each), 30-day completion. Kept as a reference for how works tenders are assessed.",
    source: "Screened by Spiritus from the e-GP bid document, 21 Nov 2026",
    screening: {
      screenedOn: "21 Nov 2026",
      what: "Siting, drilling and capacity testing of 3 boreholes at JMNIA, Bulawayo. Wet-hole contract, minimum yield 1.2 l/s per borehole. Hydrogeological assessment, geophysical siting, Class 10 uPVC casing, screens, gravel pack, sanitary seal, development, pumping and recovery tests, headworks and final report. Lot 1 siting, drilling and tests; Lot 2 installation and commissioning. One bid across the lots.",
      contract: "Single works contract. Completion within 30 days. Gantt chart programme required.",
      pricing: "No budget published. USD priced, inclusive of taxes and duties, 10% contingency where the BOQ summary indicates. Fixed for 90 days. Paid in ZiG at the bank rate after completion.",
      howPick: "Pass/fail preliminary check, technical compliance, then lowest evaluated price. Also: 3 client-letterhead references (last 5 years), flexible payment terms, shortest execution period. PRAZ SB003 required.",
      terms: "Bid valid 90 days; bid securing declaration; not subject to SPOC review. Compulsory site visit was 29 Oct 2026.",
    },
    docs: [{ name: "ACZ-0593B-2026_Tender_Screening.pdf", href: "/api/portal/files?doc=ACZ-0593B-2026_Tender_Screening.pdf", kind: "screening" }],
  },
  {
    id: "norton-cleaningmat-10-26",
    recommendation: { decision: "no-bid", reason: "Outside Fuselage's PRAZ categories; needs 3 cleaning-supply trade references." },
    screenedOn: "2026-11-17",
    reference: "CLEANINGMAT/DET/10/26",
    title: "Framework agreement: cleaning materials and detergents (37 items)",
    buyer: "Norton Town Council",
    entity: "Norton Town Council",
    category: "Cleaning materials",
    kind: "Goods",
    closes: "2026-11-19T10:00:00+02:00",
    deliveryTo: "Norton Town Council offices, within 3 days of call-off",
    publishedValue: "Not published",
    bidSecurity: "None",
    state: "closed",
    inProfile: false,
    reasons: ["Found outside Fuselage's categories", "Delivery in Norton, Fuselage's home town"],
    unknowns: [],
    checklist: [{ item: "USD 150 SPOC fee receipt", status: "missing" }, { item: "3 trade reference letters in cleaning supplies", status: "missing" }, { item: "Stock status sheet", status: "missing" }],
    summary: "Closed 19 Nov 2026, 10:00. Panel of up to 10; call-offs go to the cheapest supplier until a USD 5,000 cap. Outside the current profile, so an exploration result.",
    source: "Screened by Spiritus, 17 Nov 2026",
    docs: [],
  },

  // ---------------- Open tenders from the Government Gazette (13 Nov 2026) ----------------
  {
    id: "umz-gds-16-2026",
    recommendation: { decision: "bid", reason: "Cement and culverts are both Fuselage lines and there is time to get quotes." },
    screenedOn: "2026-11-26",
    reference: "UMZ/GDS/16/2026",
    title: "Supply and delivery of cement and culverts",
    buyer: "Umzingwane RDC",
    entity: "Umzingwane Rural District Council (URDC)",
    category: "Construction materials",
    praz: "GC007",
    kind: "Goods",
    closes: "2026-12-11T12:00:00+02:00",
    deliveryTo: "Umzingwane district (Esigodini), Matabeleland South",
    publishedValue: null,
    bidSecurity: null,
    state: "new",
    inProfile: true,
    reasons: ["Cement and culvert pipes are both on Fuselage's product list", "15 days to close: enough time to get quotes"],
    unknowns: ["Quantities and delivery points (download bid document from e-GP)", "Bid security"],
    checklist: certs(["GC007"]),
    summary: "Matches two Fuselage product lines directly. Download the bid document from e-GP to confirm quantities.",
    source: GAZETTE,
    docs: [],
  },
  {
    id: "motid-opex-agt1-2026",
    recommendation: { decision: "review", reason: "Good category fit (G/C/007). Decide once delivery locations are known: haulage drives the price." },
    screenedOn: "2026-11-26",
    reference: "MOTID/OPEX AGT1 OF 2026",
    title: "Supply and delivery of aggregates for road maintenance",
    buyer: "MOTID",
    entity: "Ministry of Transport and Infrastructural Development (MOTID)",
    category: "Construction materials",
    praz: "GC007",
    kind: "Goods",
    closes: "2026-12-14T00:00:00+02:00",
    timeKnown: false,
    deliveryTo: null,
    publishedValue: null,
    bidSecurity: null,
    state: "new",
    inProfile: true,
    reasons: ["Gazette lists PRAZ category G/C/007, which Fuselage holds", "Aggregates for roads: Stable 60 and quarry stone are Fuselage lines"],
    unknowns: ["Closing time not stated in the Gazette", "Delivery locations"],
    checklist: certs(["GC007"]),
    summary: "Road-maintenance aggregates for the Department of Roads. A second MOTID framework (AG35) closes the same day.",
    source: GAZETTE,
    docs: [],
  },
  {
    id: "motid-opex-fa-ag35-2026",
    recommendation: { decision: "review", reason: "Pair with AGT1 if bidding. Check framework length and lots first." },
    screenedOn: "2026-11-26",
    reference: "MOTID/OPEX FA AG35 OF 2026",
    title: "Framework for supply and delivery of aggregates to the Department of Roads",
    buyer: "MOTID",
    entity: "Ministry of Transport and Infrastructural Development (MOTID)",
    category: "Construction materials",
    praz: "GC007",
    kind: "Goods",
    closes: "2026-12-14T00:00:00+02:00",
    timeKnown: false,
    deliveryTo: null,
    publishedValue: null,
    bidSecurity: null,
    state: "new",
    inProfile: true,
    reasons: ["PRAZ G/C/007 framework agreement", "Repeat call-offs over the framework period"],
    unknowns: ["Closing time not stated in the Gazette", "Framework length and lots"],
    checklist: certs(["GC007"]),
    summary: "Framework agreement for road aggregates. Consider bidding together with AGT1.",
    source: GAZETTE,
    docs: [],
  },
  {
    id: "npa-groc-prov-2-26",
    recommendation: { decision: "bid", reason: "Same buyer type and goods as the Mpilo order. Price list needed by 7 Dec." },
    screenedOn: "2026-11-26",
    reference: "NPA GROC AND PROV 2/26",
    title: "Supply and delivery of groceries and provisions",
    buyer: "NPA",
    entity: "National Prosecuting Authority of Zimbabwe (NPA)",
    category: "Groceries & provisions",
    praz: "GG003",
    kind: "Goods",
    closes: "2026-12-09T00:00:00+02:00",
    deliveryTo: null,
    publishedValue: null,
    bidSecurity: null,
    state: "shortlisted",
    inProfile: true,
    reasons: ["Groceries and provisions (GG003), like the Mpilo Central Hospital order", "Public-sector buyer"],
    unknowns: ["Item list and delivery points"],
    checklist: [...certs(["GG003"]), { item: "Grocery price list", status: "missing" }],
    summary: "Gazette closing time is 0000 hrs on 9 Dec, so the effective deadline is the end of 8 Dec.",
    source: GAZETTE,
    docs: [],
  },
  {
    id: "ruwa-12-2026",
    recommendation: { decision: "review", reason: "Re-tender: find out why the first round failed before investing time." },
    screenedOn: "2026-11-26",
    reference: "Ruwa 12/2026",
    title: "Supply of groceries (framework), re-tender",
    buyer: "Ruwa Local Board",
    entity: "Ruwa Local Board (RLB)",
    category: "Groceries & provisions",
    praz: "GG003",
    kind: "Goods",
    closes: "2026-12-08T20:00:00+02:00",
    deliveryTo: "Ruwa",
    publishedValue: null,
    bidSecurity: null,
    state: "new",
    inProfile: true,
    reasons: ["Groceries framework (GG003)", "Ruwa is near Harare, about 60 km from Norton"],
    unknowns: ["Item list", "Why it was re-tendered"],
    checklist: certs(["GG003"]),
    summary: "Framework re-tender for groceries.",
    source: GAZETTE,
    docs: [],
  },
  {
    id: "cog-fa-01-11-2026",
    recommendation: { decision: "no-bid", reason: "Closes 27 Nov, 23:59: not enough time to source prices properly." },
    screenedOn: "2026-11-26",
    reference: "COG/FA/01/11/2026",
    title: "Supply and delivery of building materials (framework agreement and call-off contracts)",
    buyer: "City of Gweru",
    entity: "City of Gweru (COG)",
    category: "Construction materials",
    praz: "GC007",
    kind: "Goods",
    closes: "2026-11-27T23:59:00+02:00",
    deliveryTo: "Gweru",
    publishedValue: null,
    bidSecurity: null,
    state: "new",
    inProfile: true,
    reasons: ["Building materials framework (GC007)"],
    unknowns: ["Item list: download from e-GP today"],
    checklist: certs(["GC007"]),
    summary: "Closes tomorrow night. Only worth pursuing if the documents are already in order.",
    source: GAZETTE,
    docs: [],
  },
  {
    id: "zpc-ho-dom-121-2026",
    recommendation: { decision: "review", reason: "Hwange is about 650 km from Norton. Bid only if transport can be priced competitively." },
    screenedOn: "2026-11-26",
    reference: "ZPC/HO/DOM 121/2026",
    title: "Supply and delivery of housing materials at Hwange Power Station",
    buyer: "ZPC",
    entity: "Zimbabwe Power Company (ZPC)",
    category: "Construction materials",
    praz: "GC007",
    kind: "Goods",
    closes: "2026-12-15T17:00:00+02:00",
    deliveryTo: "Hwange Power Station",
    publishedValue: null,
    bidSecurity: null,
    state: "new",
    inProfile: true,
    reasons: ["Building and housing materials", "Large buyer with repeat demand"],
    unknowns: ["Material list", "Hwange is far from Norton: transport cost matters"],
    checklist: certs(["GC007"]),
    summary: "Materials for staff housing at Hwange. Check the haulage cost before deciding.",
    source: GAZETTE,
    docs: [],
  },
];

export const recLabel: Record<Recommendation["decision"], string> = { bid: "Bid", "no-bid": "No bid", review: "Decide" };

export const stateLabel: Record<BidState, string> = {
  new: "New match",
  shortlisted: "Shortlisted",
  input_needed: "Input needed",
  ready_for_review: "Ready for review",
  approved: "Approved",
  closed: "Closed",
};

export const sampleInbox = [
  { id: 1, unread: true, when: "Today, 08:00", title: "Closes tomorrow: COG/FA/01/11/2026", body: "City of Gweru building materials framework closes 27 Nov, 23:59.", href: "/portal/tenders/cog-fa-01-11-2026" },
  { id: 2, unread: true, when: "Today, 07:10", title: "Input needed: MUASTAPP0099/26", body: "Add quarry prices and a haulage rate to Marondera so the bid can be costed.", href: "/portal/tenders/muastapp0099-26" },
  { id: 3, unread: false, when: "Yesterday, 17:00", title: "Draft ready for review: COH/S.17/2026", body: "Price schedule v1 for lots 6–12 is ready.", href: "/portal/tenders/coh-s17-2026" },
  { id: 4, unread: false, when: "Mon, 09:00", title: "Certificates expire 31 Dec 2026", body: "All 5 PRAZ categories, ZIMRA tax clearance and NSSA need renewing.", href: "/portal/compliance" },
];

export function closesIn(iso: string, now = new Date()) {
  const ms = new Date(iso).getTime() - now.getTime();
  if (ms <= 0) return { label: "Closed", urgent: false, past: true };
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  return { label: days > 0 ? `${days}d ${hours}h left` : `${hours}h left`, urgent: days < 3, past: false };
}

export function fmtClose(iso: string, timeKnown = true) {
  return new Date(iso).toLocaleString("en-GB", {
    timeZone: "Africa/Harare",
    day: "numeric",
    month: "short",
    ...(timeKnown ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}
