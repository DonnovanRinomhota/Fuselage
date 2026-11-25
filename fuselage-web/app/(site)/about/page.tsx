import Link from "next/link";
import type { Metadata } from "next";
import { company, team, values } from "@/lib/site";

export const metadata: Metadata = { title: "About us" };

export default function About() {
  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <h1>About Fuselage Resources</h1>
          <p className="lede">
            A multi-sector supply and service company based in Norton, Zimbabwe. We make procurement simpler by giving
            clients one responsive point of contact across a broad range of essential products and services.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="wrap split">
          <div>
            <h2 style={{ fontSize: "1.6rem" }}>Our vision</h2>
            <p style={{ marginTop: ".8rem" }}>{company.vision}</p>
          </div>
          <div>
            <h2 style={{ fontSize: "1.6rem" }}>Our mission</h2>
            <p style={{ marginTop: ".8rem" }}>{company.mission}</p>
          </div>
        </div>
      </section>

      <section className="section bg-chalk" id="team">
        <div className="wrap">
          <h2>The people behind the service</h2>
          <p className="lede" style={{ marginTop: "1rem" }}>
            A hands-on management team that stays close to every client relationship, from the first enquiry through to
            delivery and after-sales support.
          </p>
          <div className="team">
            {Object.values(team).map((p) => (
              <article className="person" key={p.name}>
                <img src={p.photo} alt={`${p.name}, ${p.role}`} width={400} height={500} />
                <h3>{p.name}</h3>
                <p className="role">{p.role}</p>
                <p className="muted">{p.summary}</p>
                <span className="handles">Contact for {p.handles.toLowerCase()}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>What we stand for</h2>
          <div className="values">
            {values.map((v) => <div key={v.name}><h3>{v.name}</h3><p>{v.body}</p></div>)}
          </div>
          <p style={{ marginTop: "3rem" }}><Link href="/contact" className="btn btn-primary">Talk to our team</Link></p>
        </div>
      </section>
    </>
  );
}
