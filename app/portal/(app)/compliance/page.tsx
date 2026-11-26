import { certs, certStatus, daysLeft, REMINDER_DAYS } from "@/lib/compliance";

export const metadata = { title: "Compliance" };

export default function Compliance() {
  const inbox = process.env.TENDERS_INBOX_EMAIL || "fuselageresources@outlook.com";
  const rows = certs.map((c) => ({ ...c, days: daysLeft(c.expires) })).sort((a, b) => a.days - b.days);
  const urgent = rows.filter((r) => r.days <= 30).length;
  return (
    <>
      <h1>Compliance</h1>
      <p className="muted" style={{ marginTop: ".4rem", maxWidth: "62ch" }}>
        PRAZ, ZIMRA and NSSA certificates. An expired certificate fails a bid at the preliminary check, so Sofala
        emails {inbox} {REMINDER_DAYS.filter((d) => d > 0).join(", ")} days before each one expires.
      </p>
      {urgent > 0 && (
        <div className="callout rec-callout-no-bid" style={{ margin: "1.2rem 0" }}>
          <h3>{urgent} certificate{urgent > 1 ? "s" : ""} to renew this month</h3>
          <p>All expire 31 Dec 2026. Raise renewals with PRAZ, ZIMRA and NSSA now: tenders closing in January need valid certificates.</p>
        </div>
      )}
      <div className="table-wrap" style={{ marginTop: "1rem" }}>
        <table className="table">
          <thead><tr><th>Certificate</th><th>Issuer</th><th>Expires</th><th>Days left</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((r) => {
              const st = certStatus(r.days);
              return (
                <tr key={r.name}>
                  <td><b>{r.name}</b>{r.code && <div className="small muted">{r.code}</div>}{r.note && <div className="small muted">{r.note}</div>}</td>
                  <td>{r.issuer}</td>
                  <td>{new Date(r.expires).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td>{r.days < 0 ? "Expired" : r.days}</td>
                  <td><span className={`badge cert-${st.tone}`}>{st.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="small muted" style={{ marginTop: "1rem" }}>When a renewal arrives, send the new certificate to Spiritus and the dates here are updated. Uploading renewals in the portal comes in the next phase.</p>
    </>
  );
}
