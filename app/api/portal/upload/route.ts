import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { randomUUID } from "crypto";
import { ALLOWED_TYPES, MAX_FILE_BYTES, cleanName, sessionFromRequest } from "@/lib/api-session";
import { FILES_PREFIX, saveFileLocal, usingBlob } from "@/lib/store";

export const runtime = "nodejs";

/**
 * Production (Vercel Blob): issues a short-lived token so the browser uploads straight to private Blob storage.
 * This avoids the 4.5 MB request limit on Vercel functions, so large tender PDFs work.
 * Local development: accepts the file as multipart form data and saves it under ./.data.
 */
export async function POST(req: Request) {
  const session = await sessionFromRequest(req);

  if (usingBlob()) {
    const body = (await req.json()) as HandleUploadBody;
    // The completion callback comes from Vercel Blob, not the browser, so it carries no session cookie.
    if (body.type === "blob.generate-client-token" && !session) return NextResponse.json({ error: "Sign in to upload." }, { status: 401 });
    try {
      const json = await handleUpload({
        body,
        request: req,
        onBeforeGenerateToken: async (pathname) => {
          if (!pathname.startsWith(FILES_PREFIX)) throw new Error("Invalid upload path");
          return { allowedContentTypes: ALLOWED_TYPES, maximumSizeInBytes: MAX_FILE_BYTES, addRandomSuffix: true };
        },
        onUploadCompleted: async () => {},
      });
      return NextResponse.json(json);
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : "Upload failed" }, { status: 400 });
    }
  }

  if (!session) return NextResponse.json({ error: "Sign in to upload." }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received." }, { status: 400 });
  if (file.size > MAX_FILE_BYTES) return NextResponse.json({ error: `${file.name} is over 25 MB.` }, { status: 413 });
  if (file.type && !ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: `${file.name}: use PDF, Word, Excel, ZIP, JPG or PNG.` }, { status: 415 });
  const pathname = `${FILES_PREFIX}${new Date().toISOString().slice(0, 10)}/${randomUUID().slice(0, 8)}-${cleanName(file.name)}`;
  await saveFileLocal(pathname, Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ pathname, size: file.size, contentType: file.type });
}
