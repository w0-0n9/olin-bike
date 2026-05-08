# Olin Cycling Experiences — Tour de France 2026

Multi-language landing site and Stripe-backed booking flow for Olin Cycling
Experiences' Tour de France 2026 founding-member program. Ten places, six
days in the French Alps, July 21–26, 2026.

**Live site**: https://olin.bike

---

## Stack

- **Framework**: Next.js 14 (App Router, React Server Components)
- **i18n**: next-intl (EN / ES / FR / KO)
- **Styling**: Tailwind CSS, Adobe Fonts (Flood Std)
- **Payments**: Stripe Checkout + Webhooks (live mode)
- **Hosting**: Vercel (Fluid Compute, automatic SSL)
- **Domain**: olin.bike (Hostinger-registered, Vercel-served)
- **Language / Runtime**: TypeScript, Node 24.x

---

## Quickstart

```bash
git clone https://github.com/w0-0n9/olin-bike.git
cd olin-bike
npm install
cp .env.example .env.local       # fill in real values (see below)
npm run dev                       # http://localhost:3000
npm run lint                      # ESLint check
npm run build                     # production build (also runs tsc)
```

## Environment variables

`.env.example` documents every variable. Production secrets live in
**Vercel → Settings → Environment Variables**, never in this repo.
`.env.local` is gitignored.

| Variable | Used in | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | server | live `sk_live_…`. Never commit. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | client | live `pk_live_…`. Public OK. |
| `STRIPE_WEBHOOK_SECRET` | server | `whsec_…` from Stripe destination. |
| `NEXT_PUBLIC_SITE_URL` | server | `https://olin.bike` in production. |
| `NEXT_PUBLIC_ADOBE_FONTS_KIT_ID` | client | If unset, brush headings fall back to Caveat. |
| `NEXT_PUBLIC_SPOTS_REMAINING` | client | Number 0–10. Falls back to constant in `lib/config.ts`. |
| `NEXT_PUBLIC_INSTAGRAM_HANDLE` | client | Without `@`, e.g. `olincycle`. |

---

## Common maintenance tasks

### Update the remaining-spots counter

Two equivalent ways:

**A) Vercel env (no code change)**

Vercel → `olin-bike` project → Settings → Environment Variables →
edit `NEXT_PUBLIC_SPOTS_REMAINING` → Redeploy.

**B) Code fallback constant** (`src/lib/config.ts`)

```ts
export const SPOTS_REMAINING: number =
  Number.isFinite(parsed) && parsed >= 0 ? parsed : 6;  // ← edit here
```

Either path requires a redeploy because `NEXT_PUBLIC_*` is bundled at
build time.

### Change pricing

Single source of truth — `PRICING` in `src/lib/stripe.ts`:

```ts
export const PRICING = {
  BASE_FEE: 299000,     // $2,990 — full price
  DEPOSIT: 130000,      // $1,300 — charged at checkout
  BIKE_RENTAL: 50000,   // $500
  PRIVATE_ROOM: 110000, // $1,100
} as const;
```

Values are in **cents (USD)**. The booking form, Stripe session, and
confirmation page all read from this object — change once, propagates
everywhere. If you change the deposit, also grep `messages/*.json` for
the dollar figure since some body copy mentions it verbatim.

### Edit copy / translations

Translations live in `messages/{en,es,fr,ko}.json`. The four files
share the same key tree. When adding a new key, add it to **all
four** — TypeScript won't catch missing locales, only runtime will.

For Korean, prefer natural rhythm over literal English mirroring.
Restructure clauses if the literal mapping reads stiff.

### Update the Participant Waiver

The full document is rendered server-side in
`src/app/[locale]/legal/waiver/page.tsx`. Text is intentionally
hardcoded English — it's the canonical legal version per Section 9
(Governing Law).

When you change material terms (e.g. cancellation policy):
1. Update the page text.
2. Bump the `Updated` date in the page header.
3. Bump `consent_policy_version` in
   `src/app/api/stripe/checkout/route.ts` so future audits can tie a
   customer's consents to the exact wording they saw.

### Add a new locale

1. Add the code (e.g. `'de'`) to `routing.locales` in `src/i18n/routing.ts`.
2. Create `messages/de.json` mirroring the key tree.
3. Add a `language.de` label entry to every existing locale file.
4. `npm run build` to confirm static pages generate for every
   locale × route combination.

---

## Stripe

### Architecture

- **`/api/stripe/checkout`** — receives the booking form POST,
  re-validates required consents server-side, creates a Stripe
  Checkout Session with full booking metadata, returns the hosted
  checkout URL.
- **`/api/stripe/webhook`** — verifies Stripe signature and logs the
  booking on `checkout.session.completed`. **No database persistence
  yet** — bookings live in Stripe's session metadata only.

### Booking metadata stored on each Stripe session

Every Checkout Session carries these `metadata` fields, queryable via
the Stripe Dashboard:

```
booking_name, booking_email, booking_phone
bike_rental, bike_size, pedal_type
jersey_size
private_room
total_cents, balance_cents
locale
consent_waiver_at, consent_insurance_at, consent_privacy_at,
  consent_cancellation_at, consent_feedback_at, consent_media_at
consent_user_agent, consent_ip
consent_policy_version
```

### Webhook destination

Configured in Stripe Workbench → Event destinations:

```
URL:    https://olin-bike.vercel.app/api/stripe/webhook
Event:  checkout.session.completed
```

⚠️ The webhook URL points at the `.vercel.app` alias, **not** the
custom domain. This is intentional — the alias stays alive permanently,
and migrating to the custom domain would force a `whsec_…` rotation.
Leave this alone unless there's a concrete reason.

### Verifying the live payment flow

Two options. Both run against live Stripe — there's no separate test
mode wiring.

1. **Form-only smoke test (free)**: Visit `/en/book`, fill the form,
   tick all four required consents, click "Pay deposit", confirm the
   Stripe Checkout page loads with `$1,300`, then close the tab.
   This validates form → consent gating → Stripe redirect → price
   correctness.
2. **Full end-to-end (~$38 in non-refunded Stripe fees)**: Pay
   $1,300 with a real card, confirm the receipt email and the
   confirmation page, then refund via Stripe Dashboard. This validates
   real payment processing, webhook delivery, metadata persistence,
   and the refund flow.

---

## Deployment (Vercel)

```bash
vercel --prod                 # manual production deploy
vercel ls olin-bike           # list recent deployments
vercel logs <deployment-url>  # tail logs from a deployment
vercel env ls                 # list env vars (encrypted)
```

⚠️ **GitHub auto-deploy is currently disconnected.** Pushes to `main`
do not auto-deploy. Run `vercel --prod` after each push until the
GitHub integration is reconnected (Vercel → Settings → Git → re-link
the repo). This is a known issue, not a bug introduced by recent
work.

## Domain & SSL

- **Registrar**: Hostinger (customer's account)
- **Nameservers**: Hostinger's (`apollo/athena.dns-parking.com`)
- **DNS records** (managed in Hostinger DNS Zone Editor):
  - `A @` → `76.76.21.21`
  - `A www` → `76.76.21.21`
  - `MX`, `TXT` (SPF/DKIM) — preserved for email
  - **NO AAAA records** at apex or www — deleting Hostinger's default
    IPv6 parking record was the unlock for Vercel SSL provisioning
- **SSL**: Auto-issued by Vercel via Google Trust Services, renewed
  every ~60 days, no manual rotation
- **Canonical domain**: `www.olin.bike`. Apex 307-redirects to www.

If you ever migrate to a different domain, the Hostinger gotcha to
remember: their default parking AAAA records silently block Vercel's
SSL provisioning. Always `dig <domain> AAAA +short` after DNS changes
and confirm the result is empty.

---

## Troubleshooting

### Stripe checkout returns 500

Check `vercel logs <deployment-url>`. Most common cause:
`STRIPE_SECRET_KEY` env var missing — `getStripe()` throws at request
time, not build time, so build success doesn't guarantee runtime.

### Webhook not delivering

Stripe Dashboard → Workbench → Event destinations → click the
destination → Recent deliveries. Failure modes:
- `400 Missing signature` — request hit the endpoint without going
  through Stripe (someone poking it directly).
- `400 Webhook verification failed` — `STRIPE_WEBHOOK_SECRET` on
  Vercel doesn't match the destination's signing secret. Re-pull from
  Stripe and update.

### "All required consents must be confirmed" 400 after submit

The booking form already gates the deposit button on all four
required consents. The server re-validates as a defence in depth. A
400 here means the client posted an incomplete `consents` object —
inspect the request body in the browser Network tab.

### Translation key shows up as raw `book.foo.bar` on the page

The key is missing from at least one locale file. Check all four
`messages/*.json` — they must share the same key tree.

### Korean text wraps mid-character

`globals.css` defines `:lang(ko) { word-break: keep-all }`. If you see
mid-character breaks, the `<html lang>` attribute isn't being set —
verify `src/app/layout.tsx` calls `getLocale()` from
`next-intl/server` and renders `<html lang={locale}>`.

---

## Known gaps (intentional, not bugs)

The codebase has `TODO` comments where each of these belongs. They're
listed here so future maintainers know what's deferred:

1. **Database** — bookings only live in Stripe metadata. For TDF
   2027 onwards, integrate Postgres (Supabase or similar) and persist
   each booking + each consent as separate rows tied to the Stripe
   `session_id`.
2. **Branded confirmation email** — Stripe sends a generic receipt;
   no "Welcome to Olin TDF 2026" follow-up yet. Add Resend in the
   webhook (~1 hour).
3. **Internal new-booking alerts** — currently relies on Stripe's
   "Successful payments" email setting. Wire to Slack or Resend if
   the team prefers a richer alert.
4. **LLC governing law** — Waiver Section 9 reads "the laws of the
   United States" as a placeholder. Tighten to a specific state
   (Delaware / Wyoming) once the LLC is filed.
5. **Admin dashboard** — the Stripe Dashboard is sufficient at 10
   founding members. Consider building one when scaling to TDF 2027
   (more members, recurring trips).

---

## Project structure

```
src/
  app/
    layout.tsx                    # Root layout (<html lang>, fonts, Adobe Fonts)
    globals.css                   # Tailwind + brand classes + Korean line-break
    [locale]/
      layout.tsx                  # Per-locale layout (Nav + Footer wrapper)
      page.tsx                    # Home (Hero → … → Reserve → Quote)
      book/
        page.tsx                  # Booking form route
        confirmation/page.tsx     # Post-Stripe success page
      legal/
        waiver/page.tsx           # Full Participant Waiver document
    api/stripe/
      checkout/route.ts           # POST → Stripe Checkout Session
      webhook/route.ts            # Stripe → server signed events
  components/                     # UI components (one per file)
  lib/
    config.ts                     # Public site config (spots count, IG handle)
    stripe.ts                     # PRICING + Stripe client + booking types
    utils.ts                      # cn() className helper
  i18n/
    routing.ts                    # next-intl locale config
    request.ts                    # server locale resolver
  middleware.ts                   # next-intl URL handling

messages/
  en.json, es.json, fr.json, ko.json   # all localized strings (mirror tree)

public/images/                    # photos, partner logos, OG images
```

---

## Contact

- Operations: `info@olin.bike`
- Engineering: project maintainer
