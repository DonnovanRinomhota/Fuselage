import Link from "next/link";
import { sampleInbox } from "@/lib/sofala-sample";

export const metadata = { title: "Inbox" };

export default function Inbox() {
  return (
    <>
      <h1>Inbox</h1>
      <p className="muted" style={{ marginTop: ".4rem" }}>Every alert Sofala emails also lands here. Reading a message never approves a bid or closes a task.</p>
      <ul className="tlist panel inbox" style={{ marginTop: "1.2rem", padding: 0 }}>
        {sampleInbox.map((m) => (
          <li key={m.id} data-unread={m.unread}>
            <Link href={m.href}>{m.title}</Link>
            {m.unread && <span className="badge badge-new" style={{ marginLeft: ".6rem" }}>Unread</span>}
            <div className="meta">{m.when}. {m.body}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
