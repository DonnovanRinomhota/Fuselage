import Link from "next/link";
import { requireSession } from "@/lib/portal-session";
import { closesIn, fmtClose, sampleInbox } from "@/lib/sofala-sample";
import { allTenders } from "@/lib/tenders";
import { certs, daysLeft } from "@/lib/compliance";
import { RecBadge } from "@/components/portal/TenderBits";
import { Due, StateBadge } from "@/components/portal/TenderBits";

export const metadata = { title: "Today" };

export default async function Today() {
  const s = await requireSession();
  const tenders = await allTenders();
  const open = tenders.filter((t) => !closesIn(t.closes).past);
  const newMatches = open.filter((t) => t.state === "new" && t.inProfile);
  const uploadedToday = tenders.filter((t) => t.uploadedAt && Date.now() - +new Date(t.uploadedAt) < 86_400_000).length;
  const closingSoon = open.filter((t) => closesIn(t.closes).urgent);
  const active = open.filter((t) => ["input_needed", "ready_for_review", "shortlisted"].includes(t.state));
  const review = open.filter((t) => t.state === "ready_for_review");
  const tasks = open.filter((t) => t.task);
  const certDays = Math.min(...certs.map((c) => daysLeft(c.expires)));

  const tiles = [
    { n: newMatches.length, label: "New matches", href: "/portal/tenders?state=new" },
    { n: closingSoon.length, label: "Closing within 3 days", href: "/portal/tenders?sort=closing" },
    { n: active.length, label: "Active bids", href: "/portal/tenders?state=active" },
    { n: review.length, label: "Waiting for your review", href: "/portal/tenders?state=ready_for_review" },
  ];

  return (
    <>
      <h1>Today</h1>
      <div className="page-actions"><p className="muted" style={{ marginTop: ".4rem", marginBottom: 0 }}>Signed in as {s.name}. {open.length} open tenders{uploadedToday ? `, ${uploadedToday} uploaded today` : ""}.</p><Link href="/portal/tenders/new" className="btn btn-primary">Upload a tender</Link></div>
      <div className="today">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href}><div className="panel"><span className="n">{t.n}</span>{t.label}</div></Link>
        ))}
      </div>
      <div className="grid-2">
        <section className="panel" aria-labelledby="tasks-h">
          <div className="panel-head"><h2 id="tasks-h">Needs you</h2></div>
          {tasks.length ? (
            <ul className="tlist">
              {tasks.map((t) => (
                <li key={t.id}>
                  <div>
                    <Link className="t" href={`/portal/tenders/${t.id}`}>{t.reference}: {t.title}</Link>
                    <div className="meta">{t.task}</div>
                  </div>
                  <div style={{ textAlign: "right" }}><StateBadge state={t.state} /><br /><Due iso={t.closes} /></div>
                </li>
              ))}
            </ul>
          ) : <p className="muted">Nothing needs you right now. New matches arrive after each hourly check.</p>}
          <div className="panel-head" style={{ marginTop: "1.6rem" }}><h2>Open tenders by closing date</h2><Link href="/portal/tenders" className="small">All tenders</Link></div>
          <ul className="tlist">
            {[...open].sort((a, b) => +new Date(a.closes) - +new Date(b.closes)).map((t) => (
              <li key={t.id}>
                <div>
                  <Link className="t" href={`/portal/tenders/${t.id}`}>{t.title}</Link>
                  <div className="meta">{t.buyer} · {t.reference} · closes {fmtClose(t.closes, t.timeKnown !== false)}</div>
                </div>
                <div style={{ textAlign: "right" }}><RecBadge rec={t.recommendation} /> <StateBadge state={t.state} /><br /><Due iso={t.closes} /></div>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel" aria-labelledby="inbox-h">
          <div className="panel-head"><h2 id="inbox-h">Inbox</h2><Link href="/portal/inbox" className="small">Open inbox</Link></div>
          <ul className="tlist">
            {sampleInbox.slice(0, 4).map((m) => (
              <li key={m.id} style={{ gridTemplateColumns: "1fr" }}>
                <Link className="t" href={m.href}>{m.unread ? "● " : ""}{m.title}</Link>
                <div className="meta">{m.when}. {m.body}</div>
              </li>
            ))}
          </ul>
          <Link href="/portal/compliance" className="callout rec-callout-no-bid" style={{ display: "block", marginTop: "1rem", textDecoration: "none", color: "inherit" }}>
            <h3>Certificates expire in {certDays} days</h3>
            <p>PRAZ, ZIMRA and NSSA all expire 31 Dec 2026. Open compliance.</p>
          </Link>
        </section>
      </div>
    </>
  );
}
