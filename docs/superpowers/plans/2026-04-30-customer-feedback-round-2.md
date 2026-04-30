# Olin — Customer Feedback Round 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply Augusto/Rodrigo's round-2 feedback to olin-bike (text/asset polish, chalet grid fix, broken checkout-page nav, Korean locale), wire production Stripe + domain, and hand off a plain-Korean operations guide so the founders can run the site after launch.

**Architecture:** Almost everything is a localized content/asset edit in `src/components/*` + `messages/*.json`. New work: (1) add a fourth locale `ko` to next-intl routing and translate all three message files into Korean, (2) repair the home-anchor links so they work from `/[locale]/book`, (3) provision live Stripe + custom domain through Vercel, (4) write `docs/handover/` Korean docs covering data flow, domain DNS, and how to make future edits.

**Tech Stack:** Next.js 14 App Router, next-intl 3.21 (`localePrefix: 'always'`), Tailwind, Stripe Checkout (`/api/stripe/checkout` + `/api/stripe/webhook`), deployed on Vercel.

---

## Security note before you start

The customer pasted **live** `sk_live_…` and `pk_live_…` keys in plain text in the feedback email. Treat them as compromised:

- **Never** paste these keys into any file in this repo (this plan included).
- Add them via `vercel env add` (interactive, encrypted) or the Vercel dashboard only.
- After the deploy is verified, ask the customer to **roll the secret key** in Stripe Dashboard → Developers → API keys → "Roll key", then re-add the new `sk_live_…` to Vercel and redeploy. The publishable key (`pk_live_…`) is safe to keep — it's already public by design.

If you don't already have the values in front of you, they came in the customer email dated **2026-04-30**. Don't ask the customer to resend in chat — pull from your secure copy.

---

## File structure

**Modify:**
- `src/components/About.tsx` — remove the brush "Augusto & Rodrigo" overlay over the founders photo
- `src/components/InGoodCompany.tsx` — replace Park Tool logo asset reference, leave layout intact
- `src/components/TourBanner.tsx` — overlay Tour de France logo over the "Come to enjoy the Tour with us" image
- `src/components/ChaletGallery.tsx` — change hottub + sauna `aspect: 'portrait'` to `aspect: 'square'`
- `src/components/Navigation.tsx` — fix anchor links so they work from non-home routes (e.g. `/book`)
- `src/lib/config.ts` — change `INSTAGRAM_HANDLE` default from `olin.bike` to `olincycle`
- `.env.example` — update Instagram default and add `ko` note for locale parity
- `src/i18n/routing.ts` — add `'ko'` to locales tuple
- `src/components/LanguageSwitcher.tsx` — add `'ko'` to `LOCALES`

**Create:**
- `public/images/partners/park-tool.png` — replace existing file with new asset converted from customer's `.ai`
- `public/images/partners/tour-de-france.png` — new asset, transparent background
- `messages/ko.json` — Korean translations of all keys, parallel structure to `en.json`
- `docs/handover/01-data-flow.ko.md` — where booking data goes
- `docs/handover/02-domain-and-deploy.ko.md` — domain DNS + Vercel
- `docs/handover/03-where-to-edit.ko.md` — repo map + how to ship a future change

**Configure (no code):**
- Vercel Project → Settings → Environment Variables: add `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, update `NEXT_PUBLIC_INSTAGRAM_HANDLE`, set `NEXT_PUBLIC_SITE_URL` to the production domain
- Stripe Dashboard → Workbench → Webhooks → "Add destination" pointing at `https://olin-bike.vercel.app/api/stripe/webhook` (or the custom domain once linked)
- Vercel Project → Domains: connect customer's domain (`olin.bike` if owned)

---

# Section A — Content & visual fixes

### Task A1: Remove "Augusto & Rodrigo" overlay on the About photo

**Files:**
- Modify: `src/components/About.tsx`

- [ ] **Step 1: Delete the brush-name overlay block**

In `src/components/About.tsx`, delete lines 20–45 (the entire `{/* Brush name overlay */}` block including the gradient, both `<p>` tags with "Augusto" / "& Rodrigo", and the "Founders" kicker). The image itself stays. After the edit, the inner div should look like:

```tsx
<div className="relative aspect-[3/2] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[520px]">
  <Image
    src="/images/about-founders.jpg"
    alt="Augusto and Rodrigo — Olin founders riding in the Alps"
    fill
    sizes="(min-width: 1024px) 50vw, 100vw"
    className="object-cover"
  />
</div>
```

- [ ] **Step 2: Visual verify**

Run `npm run dev`, open `http://localhost:3000/en#about`, confirm the photo has no name overlay. Repeat at `/es#about` and `/fr#about` (no locale-specific copy in this overlay so all three should match).

- [ ] **Step 3: Commit**

```bash
git add src/components/About.tsx
git commit -m "About: remove Augusto & Rodrigo brush overlay (already in copy)"
```

---

### Task A2: Replace Park Tool partner logo

**Files:**
- Replace: `public/images/partners/park-tool.png`

The customer is sending an Illustrator (`.ai`) file. The current `InGoodCompany.tsx` references it with `width: 500, height: 300, display: 'h-16 sm:h-20'` and applies `[filter:brightness(0)]` to render it pure black. The replacement asset must be a transparent-background PNG so the brightness filter still works.

- [ ] **Step 1: Convert .ai to PNG**

Open the customer's `.ai` in Illustrator (or `inkscape --export-type=png`). Export at 2× the displayed size: target ~1000px wide, transparent background. If the artwork is multi-color, that's fine — `[filter:brightness(0)]` flattens it to black at render time.

- [ ] **Step 2: Drop into `public/images/partners/park-tool.png`**

Overwrite the file. Keep the filename — `InGoodCompany.tsx` line 41 already references it.

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Open `/en#about` (the InGoodCompany section sits just above Itinerary). Park Tool logo should render solid black, sit in line with the others, and not overflow `h-16 sm:h-20`. If proportions look off, tweak `width`/`height`/`display` values in `src/components/InGoodCompany.tsx:39-46`.

- [ ] **Step 4: Commit**

```bash
git add public/images/partners/park-tool.png src/components/InGoodCompany.tsx
git commit -m "Partners: replace Park Tool logo with corrected asset"
```

---

### Task A3: Add Tour de France logo to "Come to enjoy the Tour with us" banner

**Files:**
- Create: `public/images/partners/tour-de-france.png`
- Modify: `src/components/TourBanner.tsx`

The PDF positions the TDF logo as a small mark inside the banner image — keep the same restraint here. Customer is providing the asset (or extract from the PDF if needed using `pdfimages -all TourDeFrance_Olin_Invitation.pdf /tmp/pdfimg-` and pick the TDF lockup).

- [ ] **Step 1: Place asset at `public/images/partners/tour-de-france.png`**

Transparent background PNG, ~600px wide, official lockup. White or yellow color so it reads on the dark banner.

- [ ] **Step 2: Add the logo overlay to `TourBanner.tsx`**

After the existing radial-gradient div (around line 35) and before the `<div className="relative z-10 flex h-full items-start">` block, insert a new positioned image. Final relevant section should look like:

```tsx
{/* Subtle yellow glow for atmosphere (echoes the brand) */}
<div
  aria-hidden
  className="absolute inset-0"
  style={{
    background:
      'radial-gradient(ellipse at 30% 20%, rgba(240,230,90,0.15) 0%, transparent 50%)',
  }}
/>
{/* Tour de France lockup — bottom right, mirrors PDF */}
<div className="absolute bottom-6 right-6 z-10 sm:bottom-10 sm:right-10">
  <Image
    src="/images/partners/tour-de-france.png"
    alt="Tour de France 2026"
    width={280}
    height={120}
    sizes="(min-width: 768px) 14rem, 9rem"
    className="h-12 w-auto opacity-90 sm:h-16 md:h-20"
  />
</div>
<div className="relative z-10 flex h-full items-start">
```

- [ ] **Step 3: Visual verify**

Open `/en#tour-banner` (no anchor — TourBanner sits between Philosophy and Experience). Confirm the TDF logo sits bottom-right, doesn't overlap with the brush headline, scales down on mobile.

- [ ] **Step 4: Commit**

```bash
git add public/images/partners/tour-de-france.png src/components/TourBanner.tsx
git commit -m "TourBanner: add Tour de France lockup overlay (matches PDF)"
```

---

### Task A4: Make hot tub & sauna chalet photos square

**Files:**
- Modify: `src/components/ChaletGallery.tsx:30-34`

Currently `hottub` and `sauna` are tagged `aspect: 'portrait'` which adds `row-span-2 aspect-[3/4]` (lines 121-123). On phones the grid is 2 columns; portrait tiles span two rows and break the rhythm. Customer's call: make them square or remove. We square them — minimal change, keeps the photos.

- [ ] **Step 1: Change aspect to 'square' for both photos**

Update the `PHOTOS` array in `src/components/ChaletGallery.tsx`:

```tsx
const PHOTOS: Photo[] = [
  { src: '/images/chalet/exterior-hero.jpg', captionKey: 'exterior', aspect: 'wide' },
  { src: '/images/chalet/living.jpg', captionKey: 'living', aspect: 'landscape' },
  { src: '/images/chalet/dining.jpg', captionKey: 'dining', aspect: 'landscape' },
  { src: '/images/chalet/bedroom-view.jpg', captionKey: 'bedroom', aspect: 'landscape' },
  { src: '/images/chalet/hottub.jpg', captionKey: 'hottub', aspect: 'square' },
  { src: '/images/chalet/outdoor-dining.jpg', captionKey: 'outdoor', aspect: 'landscape' },
  { src: '/images/chalet/exterior-terrace.jpg', captionKey: 'terrace', aspect: 'landscape' },
  { src: '/images/chalet/sauna.jpg', captionKey: 'sauna', aspect: 'square' },
];
```

The button render block (lines 116-124) already defaults to `aspect-square` and only adds the portrait classes when `photo.aspect === 'portrait'`. With aspect set to `'square'`, it falls through to the default — no further code changes needed.

- [ ] **Step 2: Visual verify on mobile + laptop**

```bash
npm run dev
```

Open `/en#chalet`. In Chrome devtools toggle a phone viewport (375×812) — every tile in the grid should be square except the hero (which spans 2×2). Then resize to laptop (1440px) and confirm the grid stays uniform. The image inside is still `object-cover`, so cropping fills the square cleanly.

- [ ] **Step 3: Commit**

```bash
git add src/components/ChaletGallery.tsx
git commit -m "ChaletGallery: square hottub and sauna tiles to match grid rhythm"
```

---

### Task A5: Update Instagram handle default to `olincycle`

**Files:**
- Modify: `src/lib/config.ts:14`
- Modify: `.env.example:23`

The footer reads from `NEXT_PUBLIC_INSTAGRAM_HANDLE` and falls back to a constant. Production runs on Vercel env vars (Section D updates that), but the code default should also be correct so local dev shows the right link.

- [ ] **Step 1: Update default in `config.ts`**

```ts
// Instagram handle (without the @). Update via NEXT_PUBLIC_INSTAGRAM_HANDLE.
export const INSTAGRAM_HANDLE: string =
  process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'olincycle';

export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;
```

- [ ] **Step 2: Update default in `.env.example`**

```
NEXT_PUBLIC_INSTAGRAM_HANDLE=olincycle
```

- [ ] **Step 3: Verify**

Restart dev server (env-vars only re-read on boot). Open `/en` footer, the Instagram row should read `@olincycle` and link to `https://instagram.com/olincycle`. (The customer's actual URL `instagram.com/olincycle/` resolves the same way.)

- [ ] **Step 4: Commit**

```bash
git add src/lib/config.ts .env.example
git commit -m "Config: switch Instagram handle default to olincycle"
```

---

# Section B — Bug fix: top nav links broken on `/book`

The customer reported: "checkout page에서 뒤로 돌아가기 버튼은 되는데, 상단 메뉴 버튼들은 안눌리는데… (하단 페이지에서 The Experience 등등 메뉴는 보이는데 클릭하면 그 페이지로 안 넘어감)"

**Root cause:** `Navigation.tsx` lines 22-28 build links as bare hash anchors:

```tsx
const links = [
  { href: '#experience', label: t('experience') },
  ...
];
```

These work on `/` because the sections exist there. On `/[locale]/book`, those `id`s don't exist, so clicking does nothing (the URL becomes `/[locale]/book#experience` and the browser scrolls to nothing). The "back" button works because it's a real `<Link href="/">` (`BookingForm.tsx:78`).

**Fix:** make the nav links absolute home + hash, using next-intl's `Link` so the locale prefix is preserved.

### Task B1: Anchor nav links to home page + hash

**Files:**
- Modify: `src/components/Navigation.tsx`

- [ ] **Step 1: Switch to next-intl `Link` for the section anchors**

At the top of `src/components/Navigation.tsx`, the `Link` from `@/i18n/routing` is already imported (line 5). Update the `links` array and the JSX that renders them. Replace the `links` definition (lines 22-28) and both `<a>` rendering blocks (lines 60-72 desktop, 128-137 mobile) so they use the i18n `Link` with a `pathname`/`hash` shape:

```tsx
const links = [
  { hash: 'experience', label: t('experience') },
  { hash: 'included', label: t('included') },
  { hash: 'itinerary', label: t('itinerary') },
  { hash: 'chalet', label: t('stays') },
  { hash: 'about', label: t('about') },
];
```

Desktop nav (replaces lines 58-73):

```tsx
<nav className="hidden items-center gap-8 md:flex">
  {links.map((l) => (
    <Link
      key={l.hash}
      href={{ pathname: '/', hash: l.hash }}
      className={cn(
        'text-xs uppercase tracking-wider2 transition-colors',
        scrolled
          ? 'text-ink-muted hover:text-ink'
          : 'text-paper/80 hover:text-paper-light',
      )}
    >
      {l.label}
    </Link>
  ))}
</nav>
```

Mobile nav (replaces lines 127-137):

```tsx
<nav className="container-max flex flex-col gap-6 py-8">
  {links.map((l) => (
    <Link
      key={l.hash}
      href={{ pathname: '/', hash: l.hash }}
      onClick={() => setOpen(false)}
      className="text-sm uppercase tracking-wider2 text-ink-soft"
    >
      {l.label}
    </Link>
  ))}
  <Link
    href="/book"
    onClick={() => setOpen(false)}
    className="btn-primary self-start"
  >
    {t('reserve')}
  </Link>
</nav>
```

While we're here, also fix the desktop "Reserve" button (line 78) and the OLIN logo wordmark — the existing `<a href="/book">` on line 78 loses the locale prefix. Replace with `<Link href="/book" …>` (the `Link` import already exists). The `<Link href="/">` on line 41 is already correct.

- [ ] **Step 2: Smooth-scroll behavior on home**

When already on `/`, clicking these new `Link`s pushes a new history entry but the browser still scrolls to the hash. To preserve smooth-scroll on home, ensure `globals.css` has `html { scroll-behavior: smooth; }` (check `src/app/globals.css` — add if missing). If already present, no change.

- [ ] **Step 3: Manual verification (covers home + book + locale)**

```bash
npm run dev
```

Test matrix:
- Open `/en` → click "The Experience" → URL becomes `/en#experience`, page scrolls to Experience section. ✅
- Open `/en/book` → click "The Experience" → URL becomes `/en#experience`, page navigates back to home and lands on Experience. ✅
- Repeat one round with `/es/book` → click "Itinerary" → lands on `/es#itinerary`. (Confirms locale prefix preserved.)
- Mobile menu: open `/en/book`, click hamburger, click "Stays" → menu closes, navigates to `/en#chalet`.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navigation.tsx
git commit -m "Nav: route hash links through home so they work from /book"
```

---

# Section C — Add Korean (`ko`) locale via AI translation

Add a fourth locale that mirrors the existing en/es/fr structure. We translate using a model, then a single sweep for tone — these are marketing strings that should feel intentional, not literal. The customer is a native Korean speaker and will pick up anything that reads stiff, so favor a warm, slightly literary register over a textbook one.

### Task C1: Register `ko` in next-intl routing

**Files:**
- Modify: `src/i18n/routing.ts`
- Modify: `src/components/LanguageSwitcher.tsx`

- [ ] **Step 1: Add to locales tuple**

```ts
export const routing = defineRouting({
  locales: ['en', 'es', 'fr', 'ko'],
  defaultLocale: 'en',
  localePrefix: 'always',
});
```

- [ ] **Step 2: Add to `LanguageSwitcher` LOCALES**

```ts
const LOCALES = ['en', 'es', 'fr', 'ko'] as const;
```

The button just renders the locale code — `EN · ES · FR · KO`. If a longer label is wanted, that lives in the `language.label` translations (one-line knob, can defer).

- [ ] **Step 3: Verify routing scaffolding**

```bash
npm run dev
```

Visiting `/ko` will currently 500 because `messages/ko.json` doesn't exist yet — that's expected. The middleware should route `/` → `/en` still (defaultLocale unchanged). Confirm `/en`, `/es`, `/fr` all still render.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/routing.ts src/components/LanguageSwitcher.tsx
git commit -m "i18n: register ko locale in routing + switcher"
```

---

### Task C2: Translate `messages/en.json` → `messages/ko.json`

**Files:**
- Create: `messages/ko.json`

- [ ] **Step 1: Generate the Korean message file via AI**

Use Claude or any capable model. Prompt template:

> You are translating marketing copy for an exclusive cycling experience website (Tour de France 2026, hosted by two Latin American cyclists named Augusto and Rodrigo, French Alps, 10 riders, by-invitation only). Translate the JSON below from English to Korean. Preserve all keys exactly. Preserve `\n` line breaks, ICU placeholders like `{count}`, brand names ("Olin", "OLIN", "Rapha", "Wolf Tooth", "Park Tool", "BIEA", "VRBO", "Tour de France", "Alpe d'Huez", "Champs-Élysées"), and proper nouns. Tone: warm, considered, slightly literary — like a hand-written invitation. Avoid stiff translation-ese. Output only the JSON.

Paste the contents of `messages/en.json` and save the result to `messages/ko.json`.

- [ ] **Step 2: Lint the JSON structure**

```bash
node -e "const a=require('./messages/en.json'),b=require('./messages/ko.json');function keys(o,p=''){const r=[];for(const k in o){const np=p?p+'.'+k:k;r.push(np);if(o[k]&&typeof o[k]==='object'&&!Array.isArray(o[k]))r.push(...keys(o[k],np));}return r;}const ka=keys(a).sort(),kb=keys(b).sort();const missing=ka.filter(k=>!kb.includes(k)),extra=kb.filter(k=>!ka.includes(k));console.log('missing:',missing);console.log('extra:',extra);"
```

Expected: both arrays empty. If any keys are missing, ask the model to fill just those keys.

- [ ] **Step 3: Spot-check tone-sensitive strings**

Open `messages/ko.json` and read these in particular — these set the brand voice and benefit from a careful eye:

- `meta.description`
- `hero.kicker`, `hero.intro`
- `philosophy.body[]` — the Olin/Nahuatl etymology section is dense; literal translation will read awkward in Korean. Aim for natural rhythm.
- `tourBanner.title` — short brush headline, must stay punchy
- `about.body[]`
- `book.depositNote`

If any read clinical, ask the model for a "warmer, slightly more literary" alternative for that key only.

- [ ] **Step 4: Visual verify**

```bash
npm run dev
```

Open `/ko` and walk every section. Watch for: text overflowing brush headlines, line-break placement in `tourBanner.title` (Korean syllable density differs), price-summary alignment in `/ko/book`. Adjust message strings (not CSS) if anything wraps poorly.

- [ ] **Step 5: Commit**

```bash
git add messages/ko.json
git commit -m "i18n: add Korean (ko) translations for all UI copy"
```

---

### Task C3: Verify Korean checkout flow end-to-end

**Files:**
- (no edits — verification only)

- [ ] **Step 1: Open `/ko/book` and submit a test booking**

Use Stripe **test** keys for this verification (not the live keys from Section D). Walk: `/ko` → click Reserve → fill form → click "Pay deposit" → land on Stripe Checkout with Korean locale where supported, → use test card `4242 4242 4242 4242` → land on `/ko/book/confirmation`.

Stripe Checkout doesn't accept arbitrary locales — `ko` is supported. The checkout route doesn't pass `locale` to Stripe explicitly (`src/app/api/stripe/checkout/route.ts` — it stores in metadata only), but the success/cancel URLs include `/${locale}/book/...` (lines 51-52) so users return to the right locale. No code change needed if the flow already works; if Stripe Checkout shows English instead of Korean, optionally add `locale: locale === 'ko' ? 'ko' : 'auto'` in the `sessions.create` call.

- [ ] **Step 2: Confirm webhook log + redirect**

After paying with the test card, check `vercel logs` (or local terminal) for the `✅ Booking confirmed:` line. Confirm `confirmation` page renders Korean copy.

---

# Section D — Production: Stripe live keys, webhook, domain

This section is configuration on Vercel + Stripe dashboards — no code commits. It lives in the plan so it doesn't get skipped.

### Task D1: Add live Stripe keys to Vercel

**Files:**
- (none — Vercel project settings)

- [ ] **Step 1: Add `STRIPE_SECRET_KEY`**

```bash
vercel env add STRIPE_SECRET_KEY production
# paste the sk_live_… value when prompted, then enter
```

Repeat for `preview` and `development` environments only if the customer is OK with live keys flowing through preview deploys (usually they aren't — recommend leaving preview/dev on **test** keys).

- [ ] **Step 2: Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`**

```bash
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# paste the pk_live_… value
```

The codebase doesn't currently use `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` client-side (Checkout redirects via the URL Stripe returns from the server). It's still good hygiene to set it — when we later add Stripe Elements or the customer portal we'll need it.

- [ ] **Step 3: `STRIPE_WEBHOOK_SECRET` is added in Task D2 after creating the destination.**

---

### Task D2: Create Stripe webhook destination

The customer's screenshot shows the new dashboard wording: "Add destination" instead of "Add endpoint". Stripe rebranded "Webhook endpoints" to "Event destinations" — same thing, new name.

**Files:**
- (none — Stripe dashboard)

- [ ] **Step 1: Decide the URL**

If the custom domain (Task D3) is up: `https://olin.bike/api/stripe/webhook`. If not yet: `https://olin-bike.vercel.app/api/stripe/webhook`. (You can edit the destination URL later when the domain is ready — Stripe doesn't require recreating it.)

- [ ] **Step 2: Create the destination**

Stripe Dashboard → **Workbench** (left sidebar) → **Webhooks** → **Add destination**. Walkthrough:

1. Source: "Your account"
2. Event destination type: **Webhook endpoint**
3. API version: leave default (matches account)
4. Events to send: type `checkout.session.completed`, select it. (Don't subscribe to all events — noisy and unnecessary.)
5. Endpoint URL: paste the URL from Step 1
6. Click **Create destination**

- [ ] **Step 3: Copy signing secret**

On the destination detail page, click **Reveal** under "Signing secret" and copy the `whsec_…` value.

- [ ] **Step 4: Add to Vercel**

```bash
vercel env add STRIPE_WEBHOOK_SECRET production
# paste whsec_…
```

- [ ] **Step 5: Redeploy production**

```bash
vercel --prod
```

Or trigger via the dashboard. Env var changes don't propagate until next deploy.

- [ ] **Step 6: Send a test event from Stripe**

On the destination detail page, click **Send test event** → select `checkout.session.completed` → Send. In Vercel → Logs (production deployment), look for `✅ Booking confirmed:` printed by `src/app/api/stripe/webhook/route.ts:26`. If it 400s, recheck `STRIPE_WEBHOOK_SECRET` — most common cause is copying from the wrong destination or trailing whitespace.

---

### Task D3: Connect custom domain

**Files:**
- (none — Vercel + domain registrar)

- [ ] **Step 1: Confirm which domain**

The site references `olin.bike` (in the brushy footer wordmark `Footer.tsx:68` and metadata copy). Confirm with the customer that they've registered it. If they have a different domain, swap in everywhere.

- [ ] **Step 2: Add to Vercel project**

Vercel Dashboard → Project (`olin-bike`) → Settings → Domains → **Add** → type `olin.bike` → Add. Then add `www.olin.bike` and set it to redirect to `olin.bike` (apex preferred — shorter for the brand).

Vercel will show DNS records to set — typically:
- `A` record: `olin.bike` → `76.76.21.21`
- `CNAME` record: `www.olin.bike` → `cname.vercel-dns.com`

Exact values come from the Vercel UI — copy from there, not from this plan.

- [ ] **Step 3: Update DNS at the registrar**

Log into the registrar where the domain was bought (Cloudflare, Namecheap, GoDaddy, etc.). Replace existing `A`/`CNAME` records with what Vercel shows. Propagation usually takes 5-60 minutes; Vercel will automatically issue the SSL cert via Let's Encrypt once DNS resolves.

- [ ] **Step 4: Update `NEXT_PUBLIC_SITE_URL`**

```bash
vercel env add NEXT_PUBLIC_SITE_URL production
# paste https://olin.bike
```

This is what the Stripe checkout uses for `success_url` / `cancel_url` (`src/app/api/stripe/checkout/route.ts:20`). Without it, redirects after payment go to `localhost:3000`.

- [ ] **Step 5: Redeploy and update Stripe destination**

```bash
vercel --prod
```

Then go back to Stripe webhook destination (Task D2) → edit URL → set to `https://olin.bike/api/stripe/webhook`. Send another test event to confirm.

- [ ] **Step 6: Update Adobe Fonts kit allowlist**

Adobe Fonts → My Fonts → the Flood Std web project (`lze3zjz` per memory) → Domains → add `olin.bike`, `www.olin.bike`. Without this, brush headlines fall back to Caveat on the production domain.

---

### Task D4: Bump spots counter (when customer confirms a booking)

**Files:**
- (none, ongoing operation)

- [ ] **Step 1: Update env var on confirmation**

When the customer messages ("we're at 7 now"):

```bash
vercel env rm NEXT_PUBLIC_SPOTS_REMAINING production
vercel env add NEXT_PUBLIC_SPOTS_REMAINING production
# enter: 7
vercel --prod
```

Or use Vercel dashboard → Settings → Environment Variables → edit. The counter is read at build time (`src/lib/config.ts:6-8`) so a redeploy is required — there's no runtime fetch.

This is documented in the handover (Section E) so the customer can do it themselves later if they want.

---

### Task D5: Rotate the leaked secret key

**Files:**
- (none — Stripe + Vercel)

- [ ] **Step 1: Roll the live secret**

Stripe Dashboard → Developers → API keys → row for the live **secret** key → menu → **Roll key**. Choose "Roll immediately" (not delayed) since the only place using it is Vercel and we'll update it in seconds.

- [ ] **Step 2: Replace in Vercel**

```bash
vercel env rm STRIPE_SECRET_KEY production
vercel env add STRIPE_SECRET_KEY production
# paste the new sk_live_…
vercel --prod
```

- [ ] **Step 3: Send another test webhook**

From Stripe → Workbench → Webhooks → destination → Send test event. Confirm Vercel logs show `✅ Booking confirmed:`. If yes, the new key works.

The publishable key (`pk_live_…`) is intentionally public — no need to roll it.

---

# Section E — Handover docs in Korean

Three short markdown docs the customer can read on their phone. Plain Korean, concrete steps, no jargon left undefined. These are committed to the repo so they version with the code.

### Task E1: Write `docs/handover/01-data-flow.ko.md` — where booking data goes

**Files:**
- Create: `docs/handover/01-data-flow.ko.md`

- [ ] **Step 1: Write the doc**

Cover the actual flow as it exists today. Don't promise features that aren't built. Include:

- 사용자가 `/book` 폼 제출 → `/api/stripe/checkout` POST → Stripe Checkout 세션 생성 (`src/app/api/stripe/checkout/route.ts`)
- 결제 완료 후 Stripe → `checkout.session.completed` 이벤트 → `/api/stripe/webhook` POST (`src/app/api/stripe/webhook/route.ts`)
- 현재 저장 위치:
  1. **Stripe Dashboard** (가장 중요) — Payments 탭에서 결제 내역, 고객 이메일, 메타데이터 (이름, 자전거 옵션, 룸 옵션 등) 모두 조회 가능. 고객에게 환불할 때도 여기서.
  2. **Vercel Logs** — 웹훅이 받은 로그 (`✅ Booking confirmed:` 줄). Vercel 프로젝트 → Logs 탭. 휘발성, 30일 보관.
  3. **이메일 도착 없음 / DB 저장 없음** — 코드의 webhook route 26번째 줄에 `// TODO: Store booking in database (Supabase)`, `// TODO: Send confirmation email (Resend)` 주석으로 표시되어 있음. 향후 추가 작업 항목.
- 즉, 지금은 **Stripe Dashboard가 진실의 원천**. 매 예약마다 Augusto/Rodrigo가 Stripe 알림 메일을 받음.
- 향후 옵션 (사용자가 원할 때): Supabase 테이블에 저장 + Resend 이메일 발송 → 코드 두 줄 채우면 자동화 가능.

Format as plain Korean prose with code-block excerpts where helpful. Target 1-2 phone screens of length.

- [ ] **Step 2: Commit**

```bash
git add docs/handover/01-data-flow.ko.md
git commit -m "docs: handover guide — booking data flow (KO)"
```

---

### Task E2: Write `docs/handover/02-domain-and-deploy.ko.md` — domain + deploy

**Files:**
- Create: `docs/handover/02-domain-and-deploy.ko.md`

- [ ] **Step 1: Write the doc**

Cover:
- 도메인 연결 절차 (Section D3 한국어 요약):
  1. Vercel 프로젝트 → Settings → Domains → `olin.bike` 추가
  2. 도메인 등록 사이트(Cloudflare/Namecheap 등)에 가서 Vercel이 알려주는 A/CNAME 레코드 입력
  3. 5–60분 기다리면 자동으로 HTTPS 발급
  4. Stripe webhook URL 도메인으로 갱신, `NEXT_PUBLIC_SITE_URL` 환경변수 갱신
- 배포는 자동: GitHub `main` 브랜치에 푸시되면 Vercel이 자동 배포. 환경변수 바꾸면 재배포 필요 (`vercel --prod` 또는 Vercel UI에서 Redeploy).
- "8 → 7 → 6" 자리수 조정: `NEXT_PUBLIC_SPOTS_REMAINING` 환경변수 한 줄, 재배포 한 번. (Section D4 한국어 요약.)
- Adobe Fonts 도메인 등록 잊지 말기 (Flood Std 글꼴이 안 나오면 폰트 키트의 도메인 화이트리스트 확인).

- [ ] **Step 2: Commit**

```bash
git add docs/handover/02-domain-and-deploy.ko.md
git commit -m "docs: handover guide — domain + deploy (KO)"
```

---

### Task E3: Write `docs/handover/03-where-to-edit.ko.md` — repo map

**Files:**
- Create: `docs/handover/03-where-to-edit.ko.md`

- [ ] **Step 1: Write the doc**

A "I want to change X, where do I go?" cheat sheet. Examples:

| 바꾸고 싶은 것 | 파일 |
|---|---|
| 영어/스페인어/프랑스어/한국어 문구 전부 | `messages/{en,es,fr,ko}.json` (4개 모두 동기화) |
| 가격 (보증금/추가금) | `src/lib/stripe.ts` (PRICING 상수) |
| 남은 자리 숫자 | Vercel 환경변수 `NEXT_PUBLIC_SPOTS_REMAINING` (코드 X) |
| 인스타그램 핸들 | Vercel 환경변수 `NEXT_PUBLIC_INSTAGRAM_HANDLE` |
| Hero/About/Chalet 등 섹션 레이아웃 | `src/components/{Hero,About,ChaletGallery,...}.tsx` |
| 파트너 로고 추가/교체 | 이미지 → `public/images/partners/`, 배열 → `src/components/InGoodCompany.tsx` |
| Stripe 결제 흐름 | `src/app/api/stripe/checkout/route.ts` (세션 생성), `src/app/api/stripe/webhook/route.ts` (확정 처리) |
| 새 언어 추가 | `src/i18n/routing.ts`, `src/components/LanguageSwitcher.tsx`, 새 `messages/<locale>.json` |
| 도메인 / 배포 / 비밀키 | Vercel 대시보드 (Settings → Environment Variables, Domains) — 코드 X |

Add a "수정 → 배포" 한 사이클 절차 (clone → edit → commit → push → Vercel 자동 배포 → 확인) for the customer who wants to take over edits later or hand off to another developer.

- [ ] **Step 2: Commit**

```bash
git add docs/handover/03-where-to-edit.ko.md
git commit -m "docs: handover guide — where to edit (KO)"
```

---

# Section F — Final verification + ship

### Task F1: Type-check + lint + dev sweep

**Files:**
- (none)

- [ ] **Step 1: Run type/lint**

```bash
npm run lint
```

Expected: clean. Fix any next-intl Link type complaints (most likely site of regressions from Task B1).

- [ ] **Step 2: Build locally**

```bash
npm run build
```

Expected: success, 4 static locales prerendered (`/en`, `/es`, `/fr`, `/ko`). If `messages/ko.json` has a JSON syntax error or missing key, this is where you'll catch it.

- [ ] **Step 3: Walk all four locales in dev**

```bash
npm run dev
```

For each of `/en`, `/es`, `/fr`, `/ko`:
1. Hero loads, no overflow on brush headlines
2. Click each top-nav link from home — scrolls to right section
3. Click each top-nav link from `/[locale]/book` — navigates back to home and lands on right section
4. Footer Instagram link reads `@olincycle` and points to `https://instagram.com/olincycle`
5. Chalet grid is visually uniform (no portrait outliers)
6. About section has no name overlay
7. InGoodCompany row shows the new Park Tool logo, no missing-image icon
8. TourBanner shows TDF logo bottom-right

- [ ] **Step 4: Commit any tweaks**

```bash
git add -A
git commit -m "Polish: round-2 feedback final pass"
```

---

### Task F2: Push to main → Vercel deploys → smoke test prod

**Files:**
- (none)

- [ ] **Step 1: Push**

```bash
git push origin main
```

- [ ] **Step 2: Watch deploy**

```bash
vercel
```

Or open the Vercel dashboard. Wait for "Ready". Should take ~90 seconds.

- [ ] **Step 3: Live smoke test**

On the production URL (custom domain if Task D3 is done, otherwise the `*.vercel.app` URL):
- Walk all four locales like Task F1 Step 3
- Submit a real test booking via `/en/book` using `4242 4242 4242 4242` (Stripe test card) — wait, **production has live keys now**, so don't test with the test card. Instead, do a **$1.30 real charge** on the customer's card if they're available, or ask the customer to do it; refund immediately from Stripe Dashboard. This is the only way to verify live keys + live webhook end-to-end.
- Confirm webhook fired: Stripe Dashboard → Webhooks → destination → Recent attempts → 200 response.

- [ ] **Step 4: Notify customer**

Send a short message linking to the production URL and the three handover docs. Mention the spots-counter knob and the rotation done in Task D5.

---

## Self-review checklist (run after writing the plan, before handing off)

- ✅ Spec coverage:
  - Item 1 (remove Augusto/Rodrigo overlay) → Task A1
  - Item 5 (Park Tool logo) → Task A2
  - Item 5 (TDF logo on banner) → Task A3
  - Item 6 (chalet hottub/sauna squareness) → Task A4
  - Item 9 (Instagram handle) → Task A5 + D-env
  - Stripe keys → Task D1
  - Stripe webhook destination terminology → Task D2 (explains "Add destination" = endpoint)
  - Spots counter procedure → Task D4 + handover E2
  - Checkout-page menu bug → Section B
  - Korean locale request → Section C
  - Data storage / domain / future-edit guides → Section E (three docs)
  - Items 2, 3, 4, 7, 8, 10, 11 already shipped per customer's "approved" notes — no tasks needed.
- ✅ Placeholders: none. All file paths are exact, all code blocks are real, no "TODO: implement".
- ✅ Type consistency: `Photo.aspect` accepts `'square' | 'portrait' | 'landscape' | 'wide'` — Task A4 uses `'square'` which already exists in the union (line 24 of ChaletGallery.tsx). `links` array shape changed in Task B1 (`href` → `hash`), updated in both desktop and mobile render blocks consistently.
- ✅ Security: live Stripe secret key never written to a repo file. Rotation step included as Task D5.
