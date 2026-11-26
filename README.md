# Fuselage Resources website + Sofala portal (draft v0.1)

Next.js 15 site for Fuselage Resources (Norton, Zimbabwe), built by Spiritus Agentic Solutions.
**Status: draft for client review.** Content comes from the Fuselage company profile; nothing has been agreed with Webster yet.

## What's in it

| Area | Routes | Notes |
| --- | --- | --- |
| Public website | `/`, `/services/[slug]`, `/about`, `/how-we-work`, `/contact` | Five divisions, leadership, procurement process, quote form |
| Enquiry emails | `POST /api/enquiry` | Routes by request type: tenders → Webster, quotes/new accounts → Darleen, orders/deliveries → Janet. Sends the team email (reply-to = customer) and an auto-reply with a reference number (e.g. `FR-261125-7KQ2`) |
| Sofala portal (preview) | `/portal`, `/portal/tenders`, `/portal/tenders/[id]`, `/portal/inbox`, `/portal/settings`, `/portal/emails` | Signed-cookie login, dashboard, tender search/filters, detail with match reasons + document checklist, inbox, notification settings. **Real tenders** (team screenings + Government Gazette 13 Nov 2026) in `lib/sofala-sample.ts`; bid states are demo |
| Tender uploads | `/portal/tenders/new`, `POST /api/portal/upload`, `POST /api/portal/tenders`, `GET /api/portal/files` | Staff upload tender + screening documents (PDF/Word/Excel/ZIP/images, 25 MB each). Files go to a **private** Vercel Blob store (direct browser upload, so large PDFs work), the tender appears in the list, and the documents are emailed as attachments to `TENDERS_INBOX_EMAIL` (company tenders inbox). Downloads require sign-in |
| Sofala alert emails | `POST /api/sofala/notify` | For the Sofala agent (n8n or worker) to call. Events: `new_match`, `deadline`, `input_needed`, `draft_ready`, `tender_changed`, `failure`, `digest`. Bearer-secret auth, payload validation, `dedupeKey` → Resend idempotency (no duplicate alerts on retry) |

Requirement IDs from *Sofala Business Requirements v0.4* that this covers in shell form: FR15, FR18–FR19 (partial), FR27–FR30 (UI only), FR04 (match reasons / unknowns shown).

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

Without `RESEND_API_KEY`, emails are written to `.outbox/*.html` instead of being sent. Open them in a browser, or view every template at `/portal/emails`.

Preview portal login: whatever `PORTAL_DEMO_EMAIL` / `PORTAL_DEMO_PASSWORD` are set to (defaults `demo@fuselage.co.zw` / `sofala-preview`). **Change the password before sharing a public preview link.**

### Example: send a Sofala alert

```bash
curl -X POST https://<site>/api/sofala/notify \
  -H "Authorization: Bearer $SOFALA_NOTIFY_SECRET" -H "Content-Type: application/json" \
  -d '{
    "event": "new_match",
    "to": ["webster@example.com"],
    "recipientName": "Webster",
    "dedupeKey": "match:ACZ-0593B-2026:v1",
    "tender": { "id": "acz-0593b-2026", "reference": "ACZ-0593B-2026",
                "title": "Borehole siting, drilling and capacity test services", "buyer": "ACZ",
                "closes": "2026-12-04T10:00:00+02:00",
                "reasons": ["Borehole drilling is a current capability"], "unknowns": ["Published value"] }
  }'
# → {"status":"sent","id":"…","via":"resend"}   (502 + {"status":"failed"} on provider error)
```

## Deploy (Vercel)

1. Push this folder to a GitHub repo under the Spiritus org and import it in Vercel.
2. Set the env vars from `.env.example` (generate secrets with `openssl rand -base64 32`).
3. Verify the sending domain in Resend (adds SPF/DKIM DNS records), then set `EMAIL_FROM` on that domain.
4. Point the `.co.zw` domain at Vercel.

## Before production

- **Client sign-off.** Mako (19 Nov): don't build without talking to the client. This draft is for that conversation.
- **Real Sofala accounts.** Replace `app/api/portal/login` with a proper auth provider (individual logins, company invitations and roles, per FR25), and store data in a database instead of `lib/sofala-sample.ts`.
- **Notification settings** need saving (per user), plus quiet hours and a daily cap enforced in the agent before it calls `/api/sofala/notify`.
- **Photos.** The division photos and leadership portraits are extracted from the company profile PDF. Confirm Fuselage owns them or supply originals.
- **Rate limiting.** `/api/enquiry` has a light per-instance throttle plus a honeypot. Add a Vercel firewall rule for production.
- **Certificates.** All PRAZ categories, ZIMRA and NSSA expire 31 Dec 2026. The portal shows this as a sample notice.

## Domain & hosting cost estimate (for Jolo)

Prices checked 25 Nov 2026; confirm at checkout.

| Item | Option | Cost |
| --- | --- | --- |
| `.co.zw` domain | Prices vary widely by registrar: ~$6 to ~$140 first year, ~$23 to ~$177 renewal (domainoffer.net comparison). A local ZISPA-accredited registrar is often cheapest. | **≈ $10–60 / year** typical |
| Hosting | Vercel **Pro** ($20/month per member, includes $20 usage credit). The free Hobby plan is non-commercial only, so it can't host a client site. | **$20 / month** |
| Hosting (cheaper alternative) | Netlify or Cloudflare free tiers allow commercial use but need small adapter changes for Next.js API routes | $0–19 / month |
| Transactional email | Resend Free: 3,000 emails/month, 100/day, 1 domain. Pro: $20/month for 50,000. | **$0** at launch |
| Business mailboxes (optional) | e.g. `webster@fuselage.co.zw` via Google Workspace / Microsoft 365 / Zoho | ~$1–7 per user / month |

**Estimated running cost: about $20–25/month plus the domain.** Using a free host instead: about $1–5/month.
