import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { company, divisions } from "@/lib/site";

export function generateStaticParams() {
  return divisions.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = divisions.find((x) => x.slug === slug);
  return d ? { title: d.name, description: d.intro } : {};
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = divisions.find((x) => x.slug === slug);
  if (!d) notFound();
  const others = divisions.filter((x) => x.slug !== d.slug);

  return (
    <>
      <header className="page-head">
        <div className="wrap split" style={{ alignItems: "center" }}>
          <div>
            <p className="crumb"><Link href="/#services">Services</Link></p>
            <h1>{d.name}</h1>
            <p className="lede">{d.strap}</p>
          </div>
          <img src={d.photo} alt="" width={800} height={600} style={{ borderRadius: "var(--radius-m)", aspectRatio: "4/3", objectFit: "cover" }} />
        </div>
      </header>

      <section className="section">
        <div className="wrap split">
          <div className="stack">
            <p style={{ fontSize: "1.15rem" }}>{d.intro}</p>
            <h2 style={{ fontSize: "1.5rem", marginTop: "2rem" }}>{d.listTitle}</h2>
            <ul className="tick-list">{d.items.map((i) => <li key={i}>{i}</li>)}</ul>
            {d.extraTitle && (
              <>
                <h2 style={{ fontSize: "1.5rem", marginTop: "2rem" }}>{d.extraTitle}</h2>
                <p>{typeof d.extra === "string" ? d.extra : d.extra?.join(", ")}</p>
              </>
            )}
          </div>
          <div className="stack">
            <h2 style={{ fontSize: "1.5rem" }}>Ideal for</h2>
            <ul className="chips">{d.idealFor.map((i) => <li key={i}>{i}</li>)}</ul>
            <div className="callout" style={{ marginTop: "2rem" }}>
              <h3>{d.askTitle}</h3>
              <p>{d.ask}</p>
              <p style={{ marginTop: "1rem" }}>
                <Link href={`/contact?type=quote&service=${d.slug}#enquiry`} className="btn btn-primary">Request a quote</Link>
              </p>
              <p className="small muted" style={{ marginTop: ".8rem" }}>
                Or call {company.phones.join(" / ")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight bg-chalk">
        <div className="wrap">
          <h2 style={{ fontSize: "1.3rem" }}>We also supply</h2>
          <ul className="chips" style={{ marginTop: "1rem" }}>
            {others.map((o) => <li key={o.slug}><Link href={`/services/${o.slug}`}>{o.short}</Link></li>)}
          </ul>
        </div>
      </section>
    </>
  );
}
