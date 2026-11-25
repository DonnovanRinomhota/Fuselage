import Link from "next/link";
import type { Metadata } from "next";
import { clientGroups, process, team } from "@/lib/site";

export const metadata: Metadata = { title: "How we work" };

export default function HowWeWork() {
  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <h1>How we work</h1>
          <p className="lede">
            Simple, transparent, efficient. Our team provides quotations, specifications, order coordination and
            delivery, and works alongside procurement teams on tender requirements.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="wrap">
          <h2>From enquiry to delivery</h2>
          <ol className="process">
            {process.map((s) => <li key={s.title}><h3>{s.title}</h3><p>{s.body}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="section bg-chalk">
        <div className="wrap split">
          <div>
            <h2>Send us the right documents</h2>
            <p className="lede" style={{ marginTop: "1rem" }}>A complete request gets a faster quote.</p>
          </div>
          <div className="stack">
            <div><h3>Tenders</h3><p className="muted">The tender schedule or bid document, closing date and any clarifications issued.</p></div>
            <div><h3>Construction materials</h3><p className="muted">Bill of quantities or material list with grades, preferred brands, delivery address and required date.</p></div>
            <div><h3>Food supply for institutions</h3><p className="muted">Product list, pack sizes, temperature requirements, delivery frequency and food-safety documentation needed.</p></div>
            <div><h3>Boreholes</h3><p className="muted">Site location, intended water use and storage needs.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Who to contact</h2>
          <table className="clients">
            <tbody>
              {Object.values(team).map((p) => (
                <tr key={p.name}><th scope="row">{p.handles}</th><td>{p.name}, {p.role}</td></tr>
              ))}
            </tbody>
          </table>
          <h2 style={{ marginTop: "4rem" }}>Who we supply</h2>
          <table className="clients">
            <tbody>{clientGroups.map((c) => <tr key={c.name}><th scope="row">{c.name}</th><td>{c.who}</td></tr>)}</tbody>
          </table>
          <p style={{ marginTop: "2.5rem" }}><Link href="/contact" className="btn btn-primary">Send your requirements</Link></p>
        </div>
      </section>
    </>
  );
}
