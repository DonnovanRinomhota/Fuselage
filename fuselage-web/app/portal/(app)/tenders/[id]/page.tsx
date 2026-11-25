import Link from "next/link";
import { notFound } from "next/navigation";
import { closesIn, fmtClose, sampleTenders } from "@/lib/sofala-sample";
import { Due, StateBadge } from "@/components/portal/TenderBits";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = sampleTenders.find((x) => x.id === id);
  return { title: t?.reference ?? "Tender" };
}

const Unknown = () => <span className="unknown">Not yet known</span>;

export default async function TenderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = sampleTenders.find((x) => x.id === id);
  if (!t) notFound();
  const past = closesIn(t.closes).past;
  const supported = t.kind === "Goods" && t.inProfile;
  const statusText = { have: "On file", missing: "Missing", expires: "Expires 31 Dec 2026" } as const;

  return (
    <>
      <p className="small"><Link href="/portal/tenders">Tenders</Link></p>
      <div style={{ display: "flex", gap: ".8rem", alignItems: "center", flexWrap: "wrap", marginTop: ".3rem" }}>
        <StateBadge state={t.state} /><Due iso={t.closes} />
      </div>
      <h1 style={{ marginTop: ".6rem", maxWidth: "30ch" }}>{t.title}</h1>
      <p className="muted" style={{ marginTop: ".5rem" }}>{t.buyer} · {t.reference}</p>

      {t.task && (
        <div className="callout" style={{ margin: "1.4rem 0", borderColor: t.state === "input_needed" ? "var(--gold)" : "var(--water)", background: t.state === "input_needed" ? "var(--gold-soft)" : "var(--water-soft)" }}>
          <h3>{t.state === "input_needed" ? "Input needed" : "Ready for your review"}</h3>
          <p>{t.task}</p>
          <p style={{ marginTop: ".9rem", display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
            {t.state === "ready_for_review"
              ? (<><button className="btn btn-primary" disabled title="Available in the full release">Approve draft v1</button><button className="btn btn-ghost" disabled title="Available in the full release">Request changes</button></>)
              : <button className="btn btn-primary" disabled title="Available in the full release">Add supplier quote</button>}
          </p>
          <p className="small muted" style={{ marginTop: ".4rem" }}>Buttons are switched off in the preview.</p>
        </div>
      )}

      <div className="grid-2" style={{ marginTop: "1.4rem" }}>
        <div className="stack">
          <section className="panel">
            <h2>Summary</h2>
            <p style={{ marginTop: ".6rem" }}>{t.summary}</p>
            <dl className="kv" style={{ marginTop: "1rem" }}>
              <dt>Closes</dt><dd>{fmtClose(t.closes)} (Harare)</dd>
              <dt>Type</dt><dd>{t.kind}</dd>
              <dt>Category</dt><dd>{t.category}{t.praz ? `, PRAZ ${t.praz}` : ""}</dd>
              <dt>Delivery to</dt><dd>{t.deliveryTo ?? <Unknown />}</dd>
              <dt>Published value</dt><dd>{t.publishedValue ?? <Unknown />}</dd>
              <dt>Bid security</dt><dd>{t.bidSecurity ?? <Unknown />}</dd>
            </dl>
          </section>
          <section className="panel">
            <h2>Why it {t.inProfile ? "matches" : "appears"}</h2>
            <ul style={{ paddingLeft: "1.1rem", margin: ".6rem 0 0" }}>{t.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
            {t.unknowns.length > 0 && (
              <>
                <h3 style={{ fontSize: "1rem", marginTop: "1rem", color: "#8a6a10" }}>Not confirmed yet</h3>
                <ul style={{ paddingLeft: "1.1rem", margin: ".4rem 0 0" }}>{t.unknowns.map((u) => <li key={u}>{u}</li>)}</ul>
              </>
            )}
          </section>
        </div>
        <div className="stack">
          <section className="panel">
            <h2>Document checklist</h2>
            <ul className="check" style={{ marginTop: ".6rem" }}>
              {t.checklist.map((c) => <li key={c.item}><span>{c.item}</span><span className={`st-${c.status}`}>{statusText[c.status]}</span></li>)}
            </ul>
          </section>
          <section className="panel">
            <h2>Bid preparation</h2>
            {past ? <p style={{ marginTop: ".6rem" }}>This tender has closed.</p>
              : supported ? <p style={{ marginTop: ".6rem" }}>Sofala can read the requirements, gather prices, estimate delivery and draft the price schedule. Webster reviews and submits.</p>
              : <p style={{ marginTop: ".6rem" }}>Automated costing isn&apos;t supported for {t.kind.toLowerCase()} {t.inProfile ? "" : "outside your profile "}in the first release. Assess this one manually.</p>}
            {!past && state(t.state)}
          </section>
        </div>
      </div>
    </>
  );
}

function state(s: string) {
  if (s === "new" || s === "shortlisted") return <p><button className="btn btn-primary" disabled title="Available in the full release">Prepare bid</button></p>;
  return null;
}
