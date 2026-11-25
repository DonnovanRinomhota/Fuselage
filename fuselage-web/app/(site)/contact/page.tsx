import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";
import { company, divisions, enquiryTypes, team, type EnquiryType } from "@/lib/site";

export const metadata: Metadata = { title: "Contact & request a quote" };

export default async function Contact({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const type = (enquiryTypes.some((t) => t.value === sp.type) ? sp.type : "quote") as EnquiryType;
  const service = divisions.some((d) => d.slug === sp.service) ? sp.service! : divisions[0].slug;

  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <h1>Contact & request a quote</h1>
          <p className="lede">Send your requirements and the right person replies. You get a reference number straight away.</p>
        </div>
      </header>
      <section className="section" id="enquiry">
        <div className="wrap split split-7-4">
          <EnquiryForm defaultType={type} defaultService={service} />
          <aside className="stack">
            <div>
              <h2 style={{ fontSize: "1.3rem" }}>Call or WhatsApp</h2>
              <p style={{ marginTop: ".5rem" }}>
                {company.phones.map((p) => <span key={p}><a href={`tel:${p.replace(/\s/g, "")}`}>{p}</a><br /></span>)}
              </p>
            </div>
            <div>
              <h2 style={{ fontSize: "1.3rem" }}>Email</h2>
              <p style={{ marginTop: ".5rem" }}><a href={`mailto:${company.email}`}>{company.email}</a></p>
            </div>
            <div>
              <h2 style={{ fontSize: "1.3rem" }}>Visit</h2>
              <p style={{ marginTop: ".5rem" }}>{company.address}</p>
            </div>
            <div>
              <h2 style={{ fontSize: "1.3rem" }}>Who handles what</h2>
              <ul style={{ paddingLeft: "1.1rem", marginTop: ".5rem" }}>
                {Object.values(team).map((p) => <li key={p.name}><b>{p.handles}:</b> {p.first}</li>)}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
