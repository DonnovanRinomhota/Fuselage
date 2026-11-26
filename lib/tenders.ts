import { listUploadedTenders } from "./store";
import { sampleTenders, type Tender } from "./sofala-sample";

/** All tenders shown in the portal: uploaded ones first, then the real tenders loaded as demo data. */
export async function allTenders(): Promise<Tender[]> {
  const uploaded = await listUploadedTenders();
  const ids = new Set(uploaded.map((t) => t.id));
  return [...uploaded.sort((a, b) => (b.uploadedAt || "").localeCompare(a.uploadedAt || "")), ...sampleTenders.filter((t) => !ids.has(t.id))];
}

export async function findTender(id: string) {
  return (await allTenders()).find((t) => t.id === id) ?? null;
}
