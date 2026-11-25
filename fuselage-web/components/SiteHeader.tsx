"use client";
import Link from "next/link";
import { useState } from "react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand" aria-label="Fuselage Resources home">
          <img src="/img/logo.png" alt="Fuselage Resources" width={146} height={40} />
        </Link>
        <button className="nav-toggle" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>
          Menu
        </button>
        <nav id="main-nav" className="nav" data-open={open} aria-label="Main" onClick={() => setOpen(false)}>
          <Link href="/#services">Services</Link>
          <Link href="/how-we-work">How we work</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/portal" className="portal-link">Staff sign-in</Link>
          <Link href="/contact" className="btn btn-primary">Request a quote</Link>
        </nav>
      </div>
    </header>
  );
}
