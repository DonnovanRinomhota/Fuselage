import Link from "next/link";
import { company, divisions } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <h4>{company.name}</h4>
            <p>Essential infrastructure, building and everyday supply for government, institutions, businesses, farmers and households.</p>
          </div>
          <div>
            <h4>Services</h4>
            <ul>{divisions.map((d) => <li key={d.slug}><Link href={`/services/${d.slug}`}>{d.short}</Link></li>)}</ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/how-we-work">How we work</Link></li>
              <li><Link href="/contact">Request a quote</Link></li>
              <li><Link href="/portal">Staff portal (Sofala)</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              {company.phones.map((p) => <li key={p}><a href={`tel:${p.replace(/\s/g, "")}`}>{p}</a></li>)}
              <li><a href={`mailto:${company.email}`}>{company.email}</a></li>
              <li>{company.address}</li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} {company.name}. {company.tagline}.</span>
          <span>Norton, Zimbabwe</span>
        </div>
      </div>
    </footer>
  );
}
