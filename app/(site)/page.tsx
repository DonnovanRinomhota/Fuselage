import Link from "next/link";
import RequestTicket from "@/components/RequestTicket";
import { clientGroups, company, divisions, process } from "@/lib/site";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <h1>Water, building materials and food supply from one Norton team</h1>
            <p className="lede">
              Fuselage Resources drills boreholes, supplies construction materials and delivers meat, fresh produce and
              groceries to government entities, institutions, contractors, farmers and households.
            </p>
            <ul className="hero-divisions" aria-label="What we supply">
              {divisions.map((d) => <li key={d.slug}>{d.short}</li>)}
            </ul>
            <div className="hero-contact">
              {company.phones.map((p) => <a key={p} href={`tel:${p.replace(/\s/g, "")}`}>{p}</a>)}
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </div>
          </div>
          <RequestTicket />
        </div>
      </section>

      <section className="section" id="services">
        <div className="wrap">
          <h2>What we supply</h2>
          <p className="lede" style={{ marginTop: "1rem" }}>
            Whether you are running a road project, feeding an institution or drilling a borehole for a farm, you deal
            with one responsive point of contact.
          </p>
          <div className="divisions">
            {divisions.filter((d) => d.slug !== "groceries").map((d) => (
              <article className="division" key={d.slug}>
                <div className="division-photo">
                  <img src={d.photo} alt="" loading="lazy" width={800} height={600} />
                </div>
                <div>
                  <h3>{d.slug === "fresh-produce" ? "Fruit, vegetables, groceries & provisions" : d.name}</h3>
                  <p className="strap">{d.strap}</p>
                  <p>{d.intro}</p>
                  <ul className="tick-list">
                    {(d.slug === "fresh-produce"
                      ? [...d.items.slice(0, 4), ...divisions.find((x) => x.slug === "groceries")!.items.slice(0, 4)]
                      : d.items.slice(0, 8)
                    ).map((i) => <li key={i}>{i}</li>)}
                  </ul>
                  <Link href={`/services/${d.slug}`} className="btn btn-ghost">
                    {d.slug === "fresh-produce" ? "Produce and groceries" : `More on ${d.short.toLowerCase()}`}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-navy">
        <div className="wrap">
          <h2>How an order moves</h2>
          <p className="lede" style={{ color: "#c3d2e4", marginTop: "1rem" }}>
            Simple and transparent. We work alongside procurement teams on tender requirements, including phased deliveries.
          </p>
          <ol className="process">
            {process.map((s) => (
              <li key={s.title}><h3>{s.title}</h3><p>{s.body}</p></li>
            ))}
          </ol>
          <p style={{ marginTop: "2.5rem" }}>
            <Link href="/how-we-work" className="btn btn-ghost">See how we work with procurement teams</Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div>
            <h2>Who we supply</h2>
            <p className="lede" style={{ marginTop: "1rem" }}>
              From government to individuals. Every supply plan is tailored to the scope, quantities, location,
              specifications and timeline of the requirement.
            </p>
          </div>
          <table className="clients">
            <tbody>
              {clientGroups.map((c) => (
                <tr key={c.name}><th scope="row">{c.name}</th><td>{c.who}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </>
  );
}
