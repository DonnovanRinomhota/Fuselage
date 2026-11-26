import Link from "next/link";
import { notFound } from "next/navigation";
import { closesIn, fmtClose } from "@/lib/sofala-sample";
import { findTender } from "@/lib/tenders";
import { Due, RecBadge, StateBadge } from "@/components/portal/TenderBits";
import { recLabel } from "@/lib/sofala-sample";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await findTender(id);
  return { title: t?.reference ?? "Tender" };
}

const Unknown = () => <span className="unknown">Not yet known</span>;
const statusText = { have: "On file", missing: "Missing", expires: "Expires 31 Dec 2026" } as const;
const kindText = { tender: "Tender document", screening: "Screening", other: "Document" } as const;

export default async function TenderPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { id } = await params;
  const sp = await searchParams;
  const t = await findTender(id);
  if (!t) notFound();
  const past = closesIn(t.closes).past;
  const supported = t.kind === "Goods" && t.inProfile;
  const inbox = process.env.TENDERS_INBOX_EMAIL || process.env.ROUTE_TENDERS_EMAIL || "fuselageresources@outlook.com";

  return (
    <>
      <p className="small"><Link href="/portal/tenders">Tenders</Link></p>

      {sp.uploaded && (
        <div className={`notice ${sp.emailfail ? "notice-err" : "notice-ok"}`} role="status" style={{ margin: ".6rem 0 1rem" }}>
          {sp.emailfail
            ? "Tender saved, but the email to the tenders inbox didn't send. The documents are below; forward them manually."
            : `Tender uploaded. The documents were emailed to ${inbox}.`}
        </div>
      )}

      <div style={{ display: "flex", gap: ".8rem", alignItems: "center", flexWrap: "wrap", marginTop: ".3rem" }}>
        <RecBadge rec={t.recommendation} /><StateBadge state={t.state} /><Due iso={t.closes} />
      </div>
      <h1 style={{ marginTop: ".6rem", maxWidth: "32ch" }}>{t.title}</h1>
      <p className="muted" style={{ marginTop: ".5rem" }}>{t.entity} · {t.reference}</p>

      {t.recommendation ? (
        <div className={`callout rec-callout rec-callout-${t.recommendation.decision}`} style={{ margin: "1.2rem 0" }}>
          <h3>Recommendation: {recLabel[t.recommendation.decision]}</h3>
          <p>{t.recommendation.reason}</p>
          {t.screenedOn && <p className="small muted" style={{ marginTop: ".5rem" }}>Screened by Spiritus, {new Date(t.screenedOn).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}. Fuselage makes the final decision.</p>}
        </div>
      ) : (
        <div className="callout" style={{ margin: "1.2rem 0" }}>
          <h3>Awaiting screening</h3>
          <p>Spiritus will add a bid or no-bid recommendation once the documents are reviewed.</p>
        </div>
      )}

      {t.task && !past && (
        <div className="callout" style={{ margin: "1.4rem 0", borderColor: t.state === "input_needed" ? "var(--gold)" : "var(--water)", background: t.state === "input_needed" ? "var(--gold-soft)" : "var(--water-soft)" }}>
          <h3>{t.state === "input_needed" ? "Input needed" : "Ready for your review"}</h3>
          <p>{t.task}</p>
          <p className="small muted" style={{ marginTop: ".6rem" }}>Example task. Pricing and approvals come in the next phase.</p>
        </div>
      )}

      <div className="grid-2" style={{ marginTop: "1.4rem" }}>
        <div className="stack">
          <section className="panel">
            <h2>Summary</h2>
            <p style={{ marginTop: ".6rem" }}>{t.summary}</p>
            <dl className="kv" style={{ marginTop: "1rem" }}>
              <dt>Closes</dt><dd>{fmtClose(t.closes, t.timeKnown !== false)}{t.timeKnown === false ? " (time not stated)" : " (Harare)"}</dd>
              <dt>Procuring entity</dt><dd>{t.entity}</dd>
              <dt>Type</dt><dd>{t.kind}</dd>
              <dt>Category</dt><dd>{t.category}{t.praz ? `, PRAZ ${t.praz}` : ""}</dd>
              <dt>Delivery to</dt><dd>{t.deliveryTo ?? <Unknown />}</dd>
              <dt>Published value</dt><dd>{t.publishedValue ?? <Unknown />}</dd>
              <dt>Bid security</dt><dd>{t.bidSecurity ?? <Unknown />}</dd>
              <dt>Source</dt><dd>{t.source}</dd>
              {t.uploadedBy && (<><dt>Uploaded</dt><dd>{t.uploadedBy}, {new Date(t.uploadedAt!).toLocaleString("en-GB", { timeZone: "Africa/Harare", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</dd></>)}
            </dl>
          </section>

          {t.screening && (
            <section className="panel">
              <h2>Screening ({t.screening.screenedOn})</h2>
              <dl className="kv" style={{ marginTop: ".8rem" }}>
                <dt>What they want</dt><dd>{t.screening.what}</dd>
                <dt>Contract</dt><dd>{t.screening.contract}</dd>
                <dt>Pricing basis</dt><dd>{t.screening.pricing}</dd>
                <dt>How they pick</dt><dd>{t.screening.howPick}</dd>
                <dt>Commercial terms</dt><dd>{t.screening.terms}</dd>
              </dl>
              {t.screening.table && (
                <table className="screen-table">
                  <thead><tr>{t.screening.table.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                  <tbody>{t.screening.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
                </table>
              )}
            </section>
          )}

          {(t.reasons.length > 0 || t.unknowns.length > 0) && (
            <section className="panel">
              <h2>{t.uploadedBy ? "How it got here" : t.inProfile ? "Why it matches" : "Why it appears"}</h2>
              <ul style={{ paddingLeft: "1.1rem", margin: ".6rem 0 0" }}>{t.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
              {t.unknowns.length > 0 && (
                <>
                  <h3 style={{ fontSize: "1rem", marginTop: "1rem", color: "#8a6a10" }}>Not confirmed yet</h3>
                  <ul style={{ paddingLeft: "1.1rem", margin: ".4rem 0 0" }}>{t.unknowns.map((u) => <li key={u}>{u}</li>)}</ul>
                </>
              )}
            </section>
          )}
        </div>

        <div className="stack">
          <section className="panel">
            <h2>Documents</h2>
            {t.docs.length ? (
              <ul className="check" style={{ marginTop: ".6rem" }}>
                {t.docs.map((d) => (
                  <li key={d.href}>
                    <a href={d.href} target="_blank" rel="noopener">{d.name}</a>
                    <span className="muted small">{kindText[d.kind]}{d.size ? `, ${d.size < 1048576 ? `${Math.max(1, Math.round(d.size / 1024))} KB` : `${(d.size / 1048576).toFixed(1)} MB`}` : ""}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ marginTop: ".6rem" }}>No documents yet. Download the bid document from <a href="https://egp.praz.org.zw" target="_blank" rel="noopener">e-GP</a> and <Link href="/portal/tenders/new">upload it</Link>.</p>
            )}
          </section>

          {t.checklist.length > 0 && (
            <section className="panel">
              <h2>Document checklist</h2>
              <ul className="check" style={{ marginTop: ".6rem" }}>
                {t.checklist.map((c) => <li key={c.item}><span>{c.item}</span><span className={`st-${c.status}`}>{statusText[c.status]}</span></li>)}
              </ul>
            </section>
          )}

          <section className="panel">
            <h2>Bid preparation</h2>
            {past ? <p style={{ marginTop: ".6rem" }}>This tender has closed.</p>
              : supported ? <p style={{ marginTop: ".6rem" }}>Next phase: Sofala reads the requirements, gathers prices, estimates delivery and drafts the price schedule. Webster reviews and submits.</p>
              : <p style={{ marginTop: ".6rem" }}>Automated costing won&apos;t cover {t.kind.toLowerCase()} {t.inProfile ? "" : "outside the profile "}at first. Assess this one manually.</p>}
          </section>
        </div>
      </div>
    </>
  );
}
