import Link from "next/link";
import PrintButton from "@/components/portal/PrintButton";
import { allTenders } from "@/lib/tenders";
import { recLabel } from "@/lib/sofala-sample";
import { RecBadge, StateBadge } from "@/components/portal/TenderBits";

export const metadata = { title: "Monthly report" };

const SCREENING_FEE = 2.5; // USD per tender identified and screened (proposal, 26 Nov 2026)
const COMMISSION = 0.05; // 5% of contract value on contracts won

const monthName = (ym: string) => new Date(`${ym}-01T12:00:00`).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
const usd = (n: number) => `USD ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default async function Report({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const tenders = await allTenders();
  const months = [...new Set(tenders.map((t) => t.screenedOn?.slice(0, 7)).filter(Boolean) as string[])].sort().reverse();
  const month = sp.month && /^\d{4}-\d{2}$/.test(sp.month) ? sp.month : months[0] ?? new Date().toISOString().slice(0, 7);

  const screened = tenders.filter((t) => t.screenedOn?.startsWith(month)).sort((a, b) => (a.screenedOn! < b.screenedOn! ? -1 : 1));
  const pursued = screened.filter((t) => ["shortlisted", "input_needed", "ready_for_review", "approved"].includes(t.state));
  const byDecision = (d: string) => screened.filter((t) => t.recommendation?.decision === d).length;
  const submitted = 0; // recorded in the next phase (bid submission tracking)
  const wonValue = 0; // recorded in the next phase (contract award tracking)
  const fee = screened.length * SCREENING_FEE;

  return (
    <>
      <div className="page-actions no-print">
        <p className="small" style={{ margin: 0 }}>
          Month:{" "}
          {months.map((m, i) => (
            <span key={m}>{i > 0 && " · "}{m === month ? <b>{monthName(m)}</b> : <Link href={`/portal/report?month=${m}`}>{monthName(m)}</Link>}</span>
          ))}
        </p>
        <PrintButton />
      </div>

      <h1 style={{ marginTop: "1rem" }}>Monthly report: {monthName(month)}</h1>
      <p className="muted" style={{ marginTop: ".4rem" }}>Spiritus Agentic Solutions for Fuselage Resources</p>

      <div className="today">
        <div className="panel"><span className="n">{screened.length}</span>Tenders identified and screened</div>
        <div className="panel"><span className="n">{pursued.length}</span>Opportunities pursued</div>
        <div className="panel"><span className="n">{submitted}</span>Bids submitted</div>
        <div className="panel"><span className="n">0</span>Contracts won</div>
      </div>

      <div className="grid-2">
        <section className="panel">
          <h2>Tenders screened</h2>
          <p className="small muted" style={{ margin: ".3rem 0 .8rem" }}>Recommendations: {byDecision("bid")} {recLabel.bid.toLowerCase()}, {byDecision("review")} to decide, {byDecision("no-bid")} {recLabel["no-bid"].toLowerCase()}.</p>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Screened</th><th>Tender</th><th>Advice</th><th>Status</th></tr></thead>
              <tbody>
                {screened.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.screenedOn!).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</td>
                    <td><Link href={`/portal/tenders/${t.id}`}>{t.title}</Link><div className="small muted">{t.entity} · {t.reference}</div></td>
                    <td><RecBadge rec={t.recommendation} /></td>
                    <td><StateBadge state={t.state} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small muted" style={{ marginTop: ".8rem" }}>Tenders Fuselage uploads itself aren&apos;t counted.</p>
        </section>

        <section className="panel">
          <h2>Fees this month</h2>
          <table className="screen-table">
            <tbody>
              <tr><td>Screening admin fee</td><td>{screened.length} × {usd(SCREENING_FEE)}</td><td style={{ textAlign: "right" }}><b>{usd(fee)}</b></td></tr>
              <tr><td>Business development (5%)</td><td>{usd(wonValue)} won</td><td style={{ textAlign: "right" }}><b>{usd(wonValue * COMMISSION)}</b></td></tr>
              <tr><td colSpan={2}><b>Total (excl. VAT)</b></td><td style={{ textAlign: "right" }}><b>{usd(fee + wonValue * COMMISSION)}</b></td></tr>
            </tbody>
          </table>
          <p className="small muted" style={{ marginTop: ".8rem" }}>
            Rates from the partnership proposal (26 Nov 2026 draft). Website, hosting and marketing are invoiced separately.
            Contracts won and bid submissions are recorded in the portal from the next phase.
          </p>
        </section>
      </div>
    </>
  );
}
