import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in to Sofala", robots: { index: false } };

export default async function Login({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return (
    <div className="login">
      <section className="login-side">
        <Link href="/" className="brand"><img src="/img/logo.png" alt="Fuselage Resources" style={{ height: 40, filter: "brightness(0) invert(1)" }} /></Link>
        <div>
          <h1>Find the right tenders before they close</h1>
          <p style={{ marginTop: "1rem", color: "#c3d2e4" }}>Sofala watches PRAZ for tenders that match Fuselage, then prepares bid drafts for your review.</p>
          <ul>
            <li>New matches, with the reason each one fits</li>
            <li>Closing deadlines and the documents each bid needs</li>
            <li>Drafts waiting for your approval</li>
          </ul>
        </div>
        <p className="small" style={{ margin: 0 }}>Sofala by Spiritus Agentic Solutions</p>
      </section>
      <section className="login-form">
        <h2>Sign in</h2>
        <p className="muted" style={{ marginTop: ".5rem" }}>For Fuselage Resources staff.</p>
        {sp.error && <div className="notice notice-err" role="alert" style={{ marginBottom: "1rem" }}>That email and password don&apos;t match. Check both and try again.</div>}
        {sp.signedout && <div className="notice notice-ok" role="status" style={{ marginBottom: "1rem" }}>You&apos;re signed out.</div>}
        <form className="form" method="post" action="/api/portal/login">
          <input type="hidden" name="next" value={sp.next || "/portal"} />
          <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="username" required /></div>
          <div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div>
          <div><button className="btn btn-primary" type="submit">Sign in</button></div>
        </form>
        <p className="small muted" style={{ marginTop: "2rem" }}>
          Preview build: sign in with the preview account the Spiritus team gave you. Individual accounts and company
          invitations come with the full Sofala release.
        </p>
        <p className="small"><Link href="/">Back to fuselage website</Link></p>
      </section>
    </div>
  );
}
