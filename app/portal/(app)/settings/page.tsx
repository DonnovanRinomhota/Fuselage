import Link from "next/link";
import { requireSession } from "@/lib/portal-session";

export const metadata = { title: "Notifications" };

const alerts = [
  { key: "new_match", label: "Priority matches", hint: "Tenders that meet your priority rules", def: "immediate" },
  { key: "deadline", label: "Closing deadlines", hint: "Shortlisted or active bids closing within 3 days", def: "immediate" },
  { key: "input_needed", label: "Input needed", hint: "Preparation paused for a price, document or decision", def: "immediate" },
  { key: "draft_ready", label: "Drafts ready for review", hint: "A complete bid draft waiting for approval", def: "immediate" },
  { key: "tender_changed", label: "Tender changes", hint: "The buyer changed a tender you track", def: "immediate" },
  { key: "digest", label: "Other new matches", hint: "Everything else, collected into one email", def: "digest" },
];

export default async function Settings() {
  const s = await requireSession();
  return (
    <>
      <h1>Notifications</h1>
      <p className="muted" style={{ marginTop: ".4rem" }}>Choose what Sofala emails you and when. WhatsApp alerts arrive once Meta approves the message templates.</p>
      <form className="stack" style={{ marginTop: "1.4rem", maxWidth: 820 }}>
        <section className="panel">
          <h2>Where to send alerts</h2>
          <div className="form-row" style={{ marginTop: ".8rem" }}>
            <div className="field"><label htmlFor="em">Email</label><input id="em" defaultValue={s.email} /><p className="small muted" style={{ marginTop: ".3rem" }}>Verified</p></div>
            <div className="field"><label htmlFor="wa">WhatsApp <span className="hint">(coming later)</span></label><input id="wa" placeholder="+263 …" disabled /></div>
          </div>
        </section>
        <section className="panel">
          <h2>What to send</h2>
          <div className="table-wrap" style={{ marginTop: ".8rem" }}>
            <table className="table">
              <thead><tr><th>Alert</th><th>Send</th></tr></thead>
              <tbody>
                {alerts.map((a) => (
                  <tr key={a.key}>
                    <td><b>{a.label}</b><div className="small muted">{a.hint}</div></td>
                    <td>
                      <select defaultValue={a.def} aria-label={`${a.label} frequency`}>
                        <option value="immediate">Straight away</option>
                        <option value="digest">In the daily digest</option>
                        <option value="off">Don&apos;t email</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="panel">
          <h2>Timing</h2>
          <div className="form-row" style={{ marginTop: ".8rem" }}>
            <div className="field"><label htmlFor="dg">Daily digest time</label><input id="dg" type="time" defaultValue="17:00" /></div>
            <div className="field"><label htmlFor="cap">Most immediate alerts per day</label><input id="cap" type="number" defaultValue={5} min={1} max={50} /></div>
          </div>
          <div className="form-row">
            <div className="field"><label htmlFor="qs">Quiet hours start</label><input id="qs" type="time" defaultValue="18:00" /></div>
            <div className="field"><label htmlFor="qe">Quiet hours end</label><input id="qe" type="time" defaultValue="07:00" /></div>
          </div>
          <p className="small muted">Times are Africa/Harare. Alerts held during quiet hours go out when they end.</p>
        </section>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn btn-primary" type="button" disabled title="Saving arrives with Sofala accounts">Save notification settings</button>
          <Link href="/portal/emails">See what each email looks like</Link>
        </div>
        <p className="small muted">Saving is switched off in the preview.</p>
      </form>
    </>
  );
}
