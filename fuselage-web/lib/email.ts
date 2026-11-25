import { promises as fs } from "fs";
import path from "path";

export type OutgoingEmail = {
  to: string[];
  cc?: string[];
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  /** Resend de-duplicates retries that reuse the same key for 24h. */
  idempotencyKey?: string;
  tags?: { name: string; value: string }[];
};

export type SendResult = { ok: true; id: string; via: "resend" | "outbox" } | { ok: false; error: string };

const FROM = process.env.EMAIL_FROM || "Fuselage Resources <onboarding@resend.dev>";

/**
 * Sends through Resend when RESEND_API_KEY is set.
 * Without a key (local development) the email is written to .outbox/ so it can be opened in a browser.
 */
export async function sendEmail(email: OutgoingEmail): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return writeToOutbox(email);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        ...(email.idempotencyKey ? { "Idempotency-Key": email.idempotencyKey } : {}),
      },
      body: JSON.stringify({
        from: FROM,
        to: email.to,
        cc: email.cc?.length ? email.cc : undefined,
        reply_to: email.replyTo,
        subject: email.subject,
        html: email.html,
        text: email.text,
        tags: email.tags,
      }),
    });
    const json = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok || !json.id) return { ok: false, error: json.message || `Resend returned ${res.status}` };
    return { ok: true, id: json.id, via: "resend" };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Email provider unreachable" };
  }
}

async function writeToOutbox(email: OutgoingEmail): Promise<SendResult> {
  const id = `outbox-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const header = `<!-- to: ${email.to.join(", ")}${email.cc?.length ? ` | cc: ${email.cc.join(", ")}` : ""} | reply-to: ${email.replyTo ?? "-"} | subject: ${email.subject} -->\n`;
  try {
    const dir = process.env.VERCEL ? "/tmp/outbox" : path.join(process.cwd(), ".outbox");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, `${id}.html`), header + email.html, "utf8");
  } catch {
    // Read-only filesystem: fall through to the log line below.
  }
  console.info(`[email:outbox] ${email.subject} -> ${email.to.join(", ")}`);
  return { ok: true, id, via: "outbox" };
}

export function splitList(v: string | undefined): string[] {
  return (v || "").split(",").map((s) => s.trim()).filter(Boolean);
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
