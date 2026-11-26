import { readSession, SESSION_COOKIE } from "./session";

/** Session check for API routes (middleware only guards /portal pages). */
export async function sessionFromRequest(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split(/;\s*/).find((c) => c.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
  return readSession(token ? decodeURIComponent(token) : undefined);
}

export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-zip-compressed",
  "image/jpeg",
  "image/png",
];

export function cleanName(name: string) {
  return name.replace(/[^\w.\- ]+/g, "_").replace(/\s+/g, "_").slice(-120) || "file";
}
