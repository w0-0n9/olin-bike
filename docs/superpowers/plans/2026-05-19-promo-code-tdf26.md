# Promotion Code TDF26 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `Promotion code` text field to the Olin booking form. Entering `TDF26` discounts both total and deposit by $500 (rider pays $1,200 today instead of $1,700). Server is the source of truth — client value is re-validated.

**Architecture:** Discount logic lives in `src/lib/stripe.ts` as a small lookup table + `getPromoDiscount(code)` helper. `calculateTotal` accepts an optional `promoCode` and subtracts the discount. The booking form holds promo state, sends the applied code in the POST body. The checkout API re-validates the code and computes the Stripe `unit_amount` server-side. i18n keys added under `book.promo` in all four locales.

**Tech Stack:** Next.js 14 (App Router), React 18 client component, next-intl, Stripe SDK (server-only). No test framework configured in this repo — verification is manual via dev server + Stripe Dashboard.

**Spec:** [docs/superpowers/specs/2026-05-19-promo-code-tdf26-design.md](../specs/2026-05-19-promo-code-tdf26-design.md)

---

## File map

| File | Responsibility | Action |
| ---- | -------------- | ------ |
| `src/lib/stripe.ts` | Pricing constants, promo lookup, `calculateTotal`, types | Modify |
| `src/app/api/stripe/checkout/route.ts` | Validate booking, compute Stripe amount, create session | Modify |
| `src/components/BookingForm.tsx` | Booking form UI, promo input, price summary | Modify |
| `messages/en.json` | English copy | Modify |
| `messages/es.json` | Spanish copy | Modify |
| `messages/fr.json` | French copy | Modify |
| `messages/ko.json` | Korean copy | Modify |

---

## Task 1: Add promo lookup + helper in stripe.ts

**Files:**
- Modify: `src/lib/stripe.ts`

- [ ] **Step 1: Add `PROMO_CODES` constant + `getPromoDiscount` helper + extend `calculateTotal`**

Open `src/lib/stripe.ts`. After the existing `PRICING` constant block (around line 26), add:

```ts
// Hardcoded promotion codes. Map of normalized (uppercase, trimmed) code →
// discount in cents. One-off launch promo; keep this inline rather than
// introducing Stripe Coupons/Promotion Codes objects.
export const PROMO_CODES: Record<string, number> = {
  TDF26: 50000, // $500 off the deposit
};

export function getPromoDiscount(code?: string | null): number {
  if (!code) return 0;
  const normalized = code.trim().toUpperCase();
  return PROMO_CODES[normalized] ?? 0;
}
```

Then locate `calculateTotal` (around line 72). Replace it with:

```ts
export function calculateTotal(opts: {
  bikeRental: boolean;
  privateRoom: boolean;
  promoCode?: string | null;
}) {
  let total = PRICING.BASE_FEE;
  if (opts.bikeRental) total += PRICING.BIKE_RENTAL;
  if (opts.privateRoom) total += PRICING.PRIVATE_ROOM;
  total -= getPromoDiscount(opts.promoCode);
  return total;
}
```

Then extend the `BookingOptions` type (around line 49). Add `promoCode?: string;` after `locale: string;`:

```ts
export type BookingOptions = {
  name: string;
  email: string;
  phone: string;
  bikeRental: boolean;
  bikeSize?: BikeSize;
  pedalType?: PedalType;
  privateRoom: boolean;
  jerseySize: string;
  locale: string;
  promoCode?: string;
  consents: BookingConsents;
};
```

- [ ] **Step 2: Type-check passes**

Run: `npx tsc --noEmit`
Expected: No errors. (If errors surface in `BookingForm.tsx` or `route.ts` because they call `calculateTotal`, that's expected — they'll be fixed in later tasks. Note them and proceed.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/stripe.ts
git commit -m "feat(stripe): add TDF26 promo code lookup and discount helper"
```

---

## Task 2: Add i18n strings (en, es, fr, ko)

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/es.json`
- Modify: `messages/fr.json`
- Modify: `messages/ko.json`

- [ ] **Step 1: Add `promo` block to `messages/en.json`**

Inside the `book` object, immediately after `"depositNote": "..."` (around line 236), add:

```json
"promo": {
  "label": "Promotion code",
  "placeholder": "Enter code",
  "apply": "Apply",
  "remove": "Remove",
  "applied": "Promotion ({code})",
  "invalid": "Invalid promotion code"
},
```

Make sure the comma placement is correct (the existing line before becomes `"depositNote": "...",` and the new block is followed by the existing `"payDeposit": "..."` line).

- [ ] **Step 2: Add `promo` block to `messages/es.json`**

Mirror the same block placement under `book`:

```json
"promo": {
  "label": "Código de promoción",
  "placeholder": "Introduce el código",
  "apply": "Aplicar",
  "remove": "Quitar",
  "applied": "Promoción ({code})",
  "invalid": "Código de promoción no válido"
},
```

- [ ] **Step 3: Add `promo` block to `messages/fr.json`**

```json
"promo": {
  "label": "Code promotionnel",
  "placeholder": "Saisir le code",
  "apply": "Appliquer",
  "remove": "Retirer",
  "applied": "Promotion ({code})",
  "invalid": "Code promotionnel invalide"
},
```

- [ ] **Step 4: Add `promo` block to `messages/ko.json`**

Use natural Korean (do not mirror English clause-by-clause):

```json
"promo": {
  "label": "프로모션 코드",
  "placeholder": "코드 입력",
  "apply": "적용",
  "remove": "해제",
  "applied": "프로모션 ({code})",
  "invalid": "사용할 수 없는 코드입니다"
},
```

- [ ] **Step 5: Verify JSON validity**

Run: `for f in messages/*.json; do node -e "JSON.parse(require('fs').readFileSync('$f'))" && echo "$f OK"; done`
Expected: All four files print `OK`.

- [ ] **Step 6: Commit**

```bash
git add messages/en.json messages/es.json messages/fr.json messages/ko.json
git commit -m "i18n: add promotion code copy in en/es/fr/ko"
```

---

## Task 3: Update checkout API to validate and apply promo

**Files:**
- Modify: `src/app/api/stripe/checkout/route.ts`

- [ ] **Step 1: Update imports**

At the top of the file, replace the existing import block with:

```ts
import { NextRequest, NextResponse } from 'next/server';
import {
  getStripe,
  PRICING,
  REQUIRED_CONSENT_KEYS,
  calculateTotal,
  getPromoDiscount,
  type BookingOptions,
} from '@/lib/stripe';
```

- [ ] **Step 2: Pull `promoCode` from request body**

In the `POST` handler, locate the destructuring block (lines 13-24):

```ts
const {
  name,
  email,
  phone,
  bikeRental,
  bikeSize,
  pedalType,
  jerseySize,
  privateRoom,
  locale,
  consents,
} = body;
```

Add `promoCode` to the destructure:

```ts
const {
  name,
  email,
  phone,
  bikeRental,
  bikeSize,
  pedalType,
  jerseySize,
  privateRoom,
  locale,
  promoCode,
  consents,
} = body;
```

- [ ] **Step 3: Re-validate promo server-side and compute discounted amounts**

Find the line that calls `calculateTotal` (around line 50):

```ts
const total = calculateTotal({ bikeRental, privateRoom });
const balance = total - PRICING.DEPOSIT;
```

Replace it with:

```ts
// Re-validate promo server-side. Client value is never trusted for pricing.
const promoDiscount = getPromoDiscount(promoCode);
const appliedPromoCode = promoDiscount > 0 ? promoCode!.trim().toUpperCase() : '';
const total = calculateTotal({ bikeRental, privateRoom, promoCode });
const depositAmount = PRICING.DEPOSIT - promoDiscount;
const balance = total - depositAmount;
```

- [ ] **Step 4: Apply discounted amount to the Stripe line item**

In the `line_items` block, replace the `price_data` body so it uses the discounted deposit and reflects the promo in the description. The full block becomes:

```ts
line_items: [
  {
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'Olin TDF 2026 — Deposit',
        description: appliedPromoCode
          ? `Founding member deposit for Tour de France 2026 experience (July 21–26). Total: $${total / 100}. Balance of $${balance / 100} due 30 days before departure. Promotion ${appliedPromoCode} −$${promoDiscount / 100} applied.`
          : `Founding member deposit for Tour de France 2026 experience (July 21–26). Total: $${total / 100}. Balance of $${balance / 100} due 30 days before departure.`,
      },
      unit_amount: depositAmount,
    },
    quantity: 1,
  },
],
```

- [ ] **Step 5: Add promo to Stripe metadata**

In the `metadata` block, find the line `balance_cents: balance.toString(),` and immediately after it add:

```ts
deposit_cents: depositAmount.toString(),
promo_code: appliedPromoCode,
promo_discount_cents: promoDiscount.toString(),
```

- [ ] **Step 6: Type-check passes**

Run: `npx tsc --noEmit`
Expected: No errors in `route.ts`. (Errors may remain in `BookingForm.tsx` until Task 4.)

- [ ] **Step 7: Commit**

```bash
git add src/app/api/stripe/checkout/route.ts
git commit -m "feat(checkout): validate promo code server-side and apply to deposit"
```

---

## Task 4: Wire promo UI into BookingForm

**Files:**
- Modify: `src/components/BookingForm.tsx`

- [ ] **Step 1: Add promo state and import**

In the imports block at the top, the `@/lib/stripe` import is already there. Update it to also import `getPromoDiscount`:

```ts
import {
  BIKE_SIZES,
  PEDAL_TYPES,
  PRICING,
  calculateTotal,
  formatUSD,
  getPromoDiscount,
} from '@/lib/stripe';
```

In the component body, after the existing `useState` declarations (after `const [loading, setLoading] = useState(false);` around line 30), add:

```ts
const [promoInput, setPromoInput] = useState('');
const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
const [promoError, setPromoError] = useState(false);
```

- [ ] **Step 2: Update derived pricing math**

Find the line `const total = calculateTotal({ bikeRental, privateRoom });` (around line 40). Replace the two lines that follow it (`const total = ...` and `const balance = ...`) with:

```ts
const promoDiscount = getPromoDiscount(appliedPromo);
const total = calculateTotal({ bikeRental, privateRoom, promoCode: appliedPromo });
const depositAmount = PRICING.DEPOSIT - promoDiscount;
const balance = total - depositAmount;
```

- [ ] **Step 3: Add apply/remove handlers**

After the derived math, before `const allRequiredConsents = ...`, add:

```ts
function handleApplyPromo() {
  const code = promoInput.trim();
  if (!code) return;
  if (getPromoDiscount(code) > 0) {
    setAppliedPromo(code.toUpperCase());
    setPromoError(false);
  } else {
    setPromoError(true);
  }
}

function handleRemovePromo() {
  setAppliedPromo(null);
  setPromoInput('');
  setPromoError(false);
}
```

- [ ] **Step 4: Include promo in POST body**

In `handleSubmit`, find the `body: JSON.stringify({ ... })` block. Add `promoCode: appliedPromo ?? undefined,` immediately after `locale,`:

```ts
body: JSON.stringify({
  name,
  email,
  phone,
  bikeRental,
  bikeSize: bikeRental ? bikeSize : undefined,
  pedalType: bikeRental ? pedalType : undefined,
  jerseySize,
  privateRoom,
  locale,
  promoCode: appliedPromo ?? undefined,
  consents: {
    // ...unchanged
  },
}),
```

- [ ] **Step 5: Add promo line in price summary**

In the JSX, find the subtotal block — the `div` with `className="space-y-3 border-b border-paper-line pb-6"` (around line 324). It currently holds three rows (base fee, optional bike, optional private room). Immediately after the conditional `{privateRoom && (...)}` row but **inside** the same containing `div` (i.e. before the closing `</div>`), add:

```tsx
{appliedPromo && (
  <div className="flex justify-between text-sm text-accent-deep">
    <span>{t('promo.applied', { code: appliedPromo })}</span>
    <span>−{formatUSD(promoDiscount)}</span>
  </div>
)}
```

- [ ] **Step 6: Update Total / Deposit / Balance bindings**

Find the Total row (around line 343): `<span>{formatUSD(total)}</span>` — leave as-is (total state now reflects discount).

Find the Deposit row (around line 350-352):

```tsx
<div className="flex justify-between">
  <span className="text-sm font-semibold text-accent-deep">{t('deposit')}</span>
  <span className="text-lg font-bold text-accent-deep">{formatUSD(PRICING.DEPOSIT)}</span>
</div>
```

Replace `formatUSD(PRICING.DEPOSIT)` with `formatUSD(depositAmount)`:

```tsx
<div className="flex justify-between">
  <span className="text-sm font-semibold text-accent-deep">{t('deposit')}</span>
  <span className="text-lg font-bold text-accent-deep">{formatUSD(depositAmount)}</span>
</div>
```

The Balance row below it already uses `{formatUSD(balance)}` — no change.

- [ ] **Step 7: Add promo input block**

After the `depositNote` paragraph (around line 359-361: `<p className="mt-6 text-xs ...">{t('depositNote')}</p>`), and **before** the consent `<fieldset>` (which has `className="mt-8 border-t border-paper-line pt-6"`), add:

```tsx
<div className="mt-6 border-t border-paper-line pt-6">
  <label htmlFor="promoCode" className="kicker mb-3 block text-paper-muted">
    {t('promo.label')}
  </label>
  {appliedPromo ? (
    <div className="flex items-center gap-2">
      <div className="flex-1 border border-accent-deep bg-accent/10 px-4 py-3 text-sm font-medium text-accent-deep">
        {appliedPromo} · −{formatUSD(promoDiscount)}
      </div>
      <button
        type="button"
        onClick={handleRemovePromo}
        className="border border-paper-line bg-paper-warm px-4 py-3 text-xs font-semibold uppercase tracking-wider2 text-ink transition-colors hover:border-ink/40"
      >
        {t('promo.remove')}
      </button>
    </div>
  ) : (
    <>
      <div className="flex items-center gap-2">
        <input
          id="promoCode"
          type="text"
          value={promoInput}
          onChange={(e) => {
            setPromoInput(e.target.value);
            if (promoError) setPromoError(false);
          }}
          placeholder={t('promo.placeholder')}
          autoComplete="off"
          className={cn(
            'flex-1 border bg-paper-warm px-4 py-3 text-sm text-ink placeholder:text-paper-muted focus:outline-none focus:ring-1',
            promoError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-paper-line focus:border-accent-deep focus:ring-accent-deep',
          )}
        />
        <button
          type="button"
          onClick={handleApplyPromo}
          disabled={!promoInput.trim()}
          className={cn(
            'border px-4 py-3 text-xs font-semibold uppercase tracking-wider2 transition-colors',
            promoInput.trim()
              ? 'border-ink bg-ink text-paper-light hover:bg-navy'
              : 'cursor-not-allowed border-paper-line bg-paper-line text-paper-muted',
          )}
        >
          {t('promo.apply')}
        </button>
      </div>
      {promoError && (
        <p className="mt-2 text-xs text-red-600">{t('promo.invalid')}</p>
      )}
    </>
  )}
</div>
```

- [ ] **Step 8: Update pay button label**

Find the submit button text near the end (around line 478):

```tsx
{loading ? t('processing') : `${t('payDeposit')} — ${formatUSD(PRICING.DEPOSIT)}`}
```

Replace `PRICING.DEPOSIT` with `depositAmount`:

```tsx
{loading ? t('processing') : `${t('payDeposit')} — ${formatUSD(depositAmount)}`}
```

- [ ] **Step 9: Type-check passes**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 10: Lint passes**

Run: `npm run lint`
Expected: No new errors. (Pre-existing warnings unrelated to this change can be ignored.)

- [ ] **Step 11: Commit**

```bash
git add src/components/BookingForm.tsx
git commit -m "feat(book): promotion code input with apply/remove and live discount"
```

---

## Task 5: Manual verification

No automated test framework is configured in this repo. Verify by running the dev server and walking the flow.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Open `http://localhost:3000/en/book`.

- [ ] **Step 2: UI states — invalid code**

In the price summary, locate the new `Promotion code` field. Enter `WRONG` and click `Apply`.
Expected:
- Input border turns red.
- `Invalid promotion code` appears below in red.
- Price summary unchanged. Deposit still `$1,700`. Pay button still `Pay deposit — $1,700`.

Then start typing again — red border + error should clear.

- [ ] **Step 3: UI states — valid code (case-insensitive)**

Try each of `tdf26`, ` TDF26 `, `Tdf26`. After each Apply:
Expected:
- Input + Apply replaced with a pill showing `TDF26 · −$500` and a `Remove` button.
- New line in price summary: `Promotion (TDF26)` with `−$500`.
- `Total` decreases by $500.
- `Deposit (today)` now shows `$1,200`.
- `Balance (30 days before departure)` unchanged from the no-promo case.
- Pay button reads `Pay deposit — $1,200`.

Click `Remove`. Everything reverts to no-promo state.

- [ ] **Step 4: Math holds across toggles**

Apply `TDF26`, then toggle bike rental on/off and private room on/off in various combinations. For each combination, verify:
- Total = base fee + bike(if on) + room(if on) − $500
- Deposit = $1,200
- Balance = Total − $1,200

- [ ] **Step 5: Locale check**

Visit `/es/book`, `/fr/book`, `/ko/book`. Confirm the new field label and helper texts render in each language with no missing-key warnings in the browser console.

- [ ] **Step 6: End-to-end with Stripe (test mode)**

Confirm `.env.local` has Stripe **test** keys. With `TDF26` applied, fill the required fields, tick all four required consents, and click Pay deposit. On the Stripe Checkout page, confirm the line item says `$12.00` … wait, `$1,200.00`, with the description including `Promotion TDF26 −$500 applied`.

Complete the payment with `4242 4242 4242 4242`. After redirect to the confirmation page, open the Stripe Dashboard → Payments → the new test session → check **Metadata**:
- `promo_code: TDF26`
- `promo_discount_cents: 50000`
- `deposit_cents: 120000`
- `balance_cents` matches expected total minus $1,200

- [ ] **Step 7: Server validates independently**

Open browser DevTools → Network. Apply `TDF26`, submit. Edit the POST request body to send `promoCode: 'FAKE'` (or remove the field) via "Resend with edited" / replay tooling, or use `curl` with the same payload but a bogus code. The Stripe session that comes back must charge the **non-discounted** deposit ($1,700) — confirming the server doesn't trust client input.

Alternative simpler check: run a `curl` against the local API with the full body including all required consents and `promoCode: 'NOTREAL'`. Inspect the returned Stripe URL → confirm the session shows $1,700 deposit and empty `promo_code` metadata.

- [ ] **Step 8: Final commit if any fixups**

If any of the above checks fail and require fixes, commit each fix as its own small commit referencing the verification step that caught it.

---

## Self-review (skip after reading)

Spec coverage check: every spec requirement maps to a task.
- Field placement (price summary, between deposit/balance and consent) → Task 4 Step 7
- Case-insensitive validation → Task 1 Step 1, Task 4 Step 3, verified Task 5 Step 3
- Invalid code helper text → Task 4 Step 7, verified Task 5 Step 2
- Apply / Remove UI → Task 4 Step 7
- Money math (total & deposit −$500, balance unchanged) → Task 1, Task 3 Step 3, Task 4 Step 2, verified Task 5 Step 4
- Promotion line in price summary → Task 4 Step 5
- Pay button label updates → Task 4 Step 8
- Server-side re-validation → Task 3 Step 3, verified Task 5 Step 7
- Stripe metadata audit trail → Task 3 Step 5, verified Task 5 Step 6
- Line item description mentions promo → Task 3 Step 4, verified Task 5 Step 6
- i18n keys in en/es/fr/ko → Task 2

No placeholders, all code blocks complete, all paths exact.
