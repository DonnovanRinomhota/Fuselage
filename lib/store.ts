import { promises as fs } from "fs";
import path from "path";
import { del, get, list, put } from "@vercel/blob";
import type { Tender } from "./sofala-sample";

/**
 * Storage for uploaded tenders and their documents.
 * - Production: Vercel Blob, PRIVATE store (files are only readable by the server; users download through
 *   /api/portal/files after signing in).
 * - Local development (no BLOB_READ_WRITE_TOKEN): files live in ./.data
 */
export const usingBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const LOCAL_ROOT = () => (process.env.VERCEL ? "/tmp/fuselage-data" : path.join(process.cwd(), ".data"));
const RECORDS = "records/tenders/";
export const FILES_PREFIX = "files/";

function safeLocal(p: string) {
  const full = path.resolve(LOCAL_ROOT(), p);
  if (!full.startsWith(path.resolve(LOCAL_ROOT()) + path.sep)) throw new Error("bad path");
  return full;
}

export async function saveFileLocal(pathname: string, data: Buffer) {
  const full = safeLocal(pathname);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, data);
}

/** Read an uploaded file. Returns null if it doesn't exist. */
export async function readFile(pathname: string): Promise<{ data: Buffer; contentType: string } | null> {
  if (!pathname.startsWith(FILES_PREFIX)) return null;
  if (usingBlob()) {
    const r = await get(pathname, { access: "private" }).catch(() => null);
    if (!r || r.statusCode !== 200) return null;
    const data = Buffer.from(await new Response(r.stream).arrayBuffer());
    return { data, contentType: r.blob.contentType || "application/octet-stream" };
  }
  try {
    const data = await fs.readFile(safeLocal(pathname));
    return { data, contentType: pathname.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/octet-stream" };
  } catch {
    return null;
  }
}

export async function saveTender(t: Tender) {
  const body = JSON.stringify(t);
  if (usingBlob()) {
    await put(`${RECORDS}${t.id}.json`, body, { access: "private", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true });
  } else {
    await saveFileLocal(`${RECORDS}${t.id}.json`, Buffer.from(body));
  }
}

export async function listUploadedTenders(): Promise<Tender[]> {
  try {
    if (usingBlob()) {
      const { blobs } = await list({ prefix: RECORDS, limit: 1000 });
      const out = await Promise.all(
        blobs.map(async (b) => {
          const r = await get(b.pathname, { access: "private", useCache: false }).catch(() => null);
          if (!r || r.statusCode !== 200) return null;
          return JSON.parse(await new Response(r.stream).text()) as Tender;
        }),
      );
      return out.filter((x): x is Tender => !!x);
    }
    const dir = safeLocal(RECORDS + "x").replace(/x$/, "");
    const names = await fs.readdir(dir).catch(() => [] as string[]);
    const out = await Promise.all(names.filter((n) => n.endsWith(".json")).map(async (n) => JSON.parse(await fs.readFile(path.join(dir, n), "utf8")) as Tender));
    return out;
  } catch (e) {
    console.error("[store] listing uploaded tenders failed", e);
    return [];
  }
}

export async function deleteTenderRecord(id: string) {
  if (usingBlob()) await del(`${RECORDS}${id}.json`).catch(() => undefined);
  else await fs.rm(safeLocal(`${RECORDS}${id}.json`)).catch(() => undefined);
}
