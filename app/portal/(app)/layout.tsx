import Link from "next/link";
import type { Metadata } from "next";
import PortalNav from "@/components/portal/PortalNav";
import { requireSession } from "@/lib/portal-session";
import { sampleInbox } from "@/lib/sofala-sample";

export const metadata: Metadata = { title: { default: "Sofala", template: "%s | Sofala" }, robots: { index: false } };

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const s = await requireSession();
  return (
    <div className="portal">
      <header className="portal-top">
        <Link href="/portal" className="portal-mark"><b>SOFALA</b><span>{s.company}</span></Link>
        <div className="who">
          <span>{s.name}</span>
          <form method="post" action="/api/portal/logout"><button type="submit">Sign out</button></form>
        </div>
      </header>
      <p className="sample-bar" role="note">
        Demo: tenders are real (team screenings and the 13 Nov 2026 Government Gazette). Bid progress, tasks and
        inbox messages are examples until the automatic PRAZ connection is live.
      </p>
      <PortalNav unread={sampleInbox.filter((m) => m.unread).length} />
      <main className="portal-main" id="main">{children}</main>
    </div>
  );
}
