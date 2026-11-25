import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, SESSION_COOKIE } from "./session";

export async function requireSession() {
  const s = await readSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!s) redirect("/portal/login");
  return s;
}
