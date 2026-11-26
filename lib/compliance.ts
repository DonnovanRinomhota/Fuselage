// Fuselage compliance documents (document pack, Nov 2026: every certificate expires 31 Dec 2026).
// Update dates here when renewals are uploaded. Next phase: edit these in the portal.

export type Cert = { name: string; issuer: string; code?: string; expires: string; note?: string };

export const certs: Cert[] = [
  { name: "PRAZ supplier registration: construction materials", issuer: "PRAZ", code: "GC007", expires: "2026-12-31" },
  { name: "PRAZ supplier registration: provisions and groceries", issuer: "PRAZ", code: "GG003", expires: "2026-12-31" },
  { name: "PRAZ supplier registration: meat products", issuer: "PRAZ", code: "GB003", expires: "2026-12-31" },
  { name: "PRAZ supplier registration: 2 further categories", issuer: "PRAZ", expires: "2026-12-31", note: "Codes are in the document pack index (00 – INDEX)" },
  { name: "Tax clearance (ITF263)", issuer: "ZIMRA", expires: "2026-12-31" },
  { name: "NSSA compliance certificate", issuer: "NSSA", expires: "2026-12-31" },
];

/** Days at which a reminder email goes to the tenders inbox. */
export const REMINDER_DAYS = [60, 30, 14, 7, 3, 1, 0];

export function daysLeft(iso: string, now = new Date()) {
  const end = new Date(`${iso}T23:59:59+02:00`).getTime();
  return Math.floor((end - now.getTime()) / 86_400_000); // whole days remaining: 0 on the expiry day, negative after
}

export function certStatus(days: number): { label: string; tone: "ok" | "soon" | "now" | "expired" } {
  if (days < 0) return { label: "Expired: bids blocked", tone: "expired" };
  if (days <= 30) return { label: "Renew now", tone: "now" };
  if (days <= 60) return { label: "Renewal due soon", tone: "soon" };
  return { label: "Valid", tone: "ok" };
}
