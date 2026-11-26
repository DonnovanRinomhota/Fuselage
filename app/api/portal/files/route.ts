import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { sessionFromRequest } from "@/lib/api-session";
import { readFile } from "@/lib/store";

export const runtime = "nodejs";

/** Downloads for signed-in users only: ?p=<uploaded pathname> or ?doc=<bundled screening PDF>. */
export async function GET(req: Request) {
  if (!(await sessionFromRequest(req))) return NextResponse.json({ error: "Sign in to download." }, { status: 401 });
  const url = new URL(req.url);
  const doc = url.searchParams.get("doc");
  const p = url.searchParams.get("p");

  let data: Buffer | null = null;
  let type = "application/pdf";
  let name = "document";

  if (doc && /^[\w.-]+\.pdf$/.test(doc)) {
    data = await fs.readFile(path.join(process.cwd(), "private-docs", doc)).catch(() => null);
    name = doc;
  } else if (p) {
    const f = await readFile(p);
    if (f) ({ data, contentType: type } = f);
    name = p.split("/").pop() || name;
  }
  if (!data) return NextResponse.json({ error: "File not found." }, { status: 404 });

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `inline; filename="${name.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
