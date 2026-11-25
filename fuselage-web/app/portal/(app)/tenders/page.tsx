import Link from "next/link";
import { closesIn, fmtClose, sampleTenders, stateLabel } from "@/lib/sofala-sample";
import { Due, StateBadge } from "@/components/portal/TenderBits";

export const metadata = { title: "Tenders" };

export default async function Tenders({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const q = (sp.q || "").toLowerCase().trim();
  const scope = sp.scope === "all" ? "all" : "profile";
  const state = sp.state || "";
  const category = sp.category || "";
  const showClosed = sp.closed === "1";

  const categories = [...new Set(sampleTenders.map((t) => t.category))].sort();
  let rows = sampleTenders.filter((t) => {
    if (scope === "profile" && !t.inProfile) return false;
    if (!showClosed && closesIn(t.closes).past) return false;
    if (q && !`${t.title} ${t.reference} ${t.buyer}`.toLowerCase().includes(q)) return false;
    if (category && t.category !== category) return false;
    if (state === "active") return ["shortlisted", "input_needed", "ready_for_review"].includes(t.state);
    if (state && t.state !== state) return false;
    return true;
  });
  rows = rows.sort((a, b) => +new Date(a.closes) - +new Date(b.closes));
  const active = [q && `“${sp.q}”`, category, state && (state === "active" ? "Active bids" : stateLabel[state as keyof typeof stateLabel]), showClosed && "including closed"].filter(Boolean);

  return (
    <>
      <h1>Tenders</h1>
      <div className="tabs" role="navigation" aria-label="Scope">
        <Link href="/portal/tenders" aria-current={scope === "profile" ? "page" : undefined}>Recommended for Fuselage</Link>
        <Link href="/portal/tenders?scope=all&closed=1" aria-current={scope === "all" ? "page" : undefined}>Explore all categories</Link>
      </div>
      {scope === "all" && <p className="small muted">Exploring outside your profile doesn&apos;t change your company settings or make Fuselage eligible.</p>}
      <form className="filters" method="get">
        <input type="hidden" name="scope" value={scope} />
        <div className="field"><label htmlFor="q">Keyword or reference</label><input id="q" name="q" defaultValue={sp.q} /></div>
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" defaultValue={category}>
            <option value="">Any</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="state">Status</label>
          <select id="state" name="state" defaultValue={state}>
            <option value="">Any</option>
            <option value="active">Active bids</option>
            {Object.entries(stateLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="field" style={{ minWidth: 0 }}>
          <label><input type="checkbox" name="closed" value="1" defaultChecked={showClosed} style={{ width: "auto", marginRight: ".4rem" }} />Show closed</label>
        </div>
        <button className="btn btn-primary" type="submit">Apply filters</button>
        {active.length > 0 && <Link href={`/portal/tenders${scope === "all" ? "?scope=all" : ""}`} className="small">Clear filters</Link>}
      </form>
      <p className="small muted" aria-live="polite">{rows.length} {rows.length === 1 ? "tender" : "tenders"}{active.length ? `, filtered by ${active.join(", ")}` : ""}. Sorted by closing date.</p>
      {rows.length ? (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Tender</th><th>Buyer</th><th>Category</th><th>Closes</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id}>
                  <td><Link href={`/portal/tenders/${t.id}`}>{t.title}</Link><div className="small muted">{t.reference}</div></td>
                  <td>{t.buyer}</td>
                  <td>{t.category}{t.praz ? <div className="small muted">{t.praz}</div> : null}</td>
                  <td>{fmtClose(t.closes)}<br /><Due iso={t.closes} /></td>
                  <td><StateBadge state={t.state} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="panel"><p style={{ margin: 0 }}>No tenders match these filters. Clear a filter, or switch to <Link href="/portal/tenders?scope=all&closed=1">Explore all categories</Link>.</p></div>
      )}
    </>
  );
}
