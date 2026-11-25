"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PortalNav({ unread }: { unread: number }) {
  const path = usePathname();
  const items = [
    { href: "/portal", label: "Today" },
    { href: "/portal/tenders", label: "Tenders" },
    { href: "/portal/inbox", label: "Inbox", count: unread },
  ];
  const settings = [
    { href: "/portal/settings", label: "Notifications" },
    { href: "/portal/emails", label: "Email previews" },
  ];
  const cur = (h: string) => (h === "/portal" ? path === h : path.startsWith(h)) ? "page" : undefined;
  return (
    <nav className="portal-nav" aria-label="Portal">
      <ul>
        {items.map((i) => (
          <li key={i.href}><Link href={i.href} aria-current={cur(i.href)}>{i.label}{i.count ? <span className="count" aria-label={`${i.count} unread`}>{i.count}</span> : null}</Link></li>
        ))}
        <li className="sep" aria-hidden="true" />
        {settings.map((i) => <li key={i.href}><Link href={i.href} aria-current={cur(i.href)}>{i.label}</Link></li>)}
        <li className="sep" aria-hidden="true" />
        <li><Link href="/">Fuselage website</Link></li>
      </ul>
    </nav>
  );
}
