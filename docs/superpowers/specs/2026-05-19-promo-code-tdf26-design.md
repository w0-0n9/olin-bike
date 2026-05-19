# Promotion Code (TDF26) — Design

**Date:** 2026-05-19
**Status:** Approved (pending spec review)
**Owner:** jinwoong.shin

## Goal

Add a single hardcoded promotion code `TDF26` to the Olin booking form that
discounts the founding-member deposit by **$500** at checkout. Rider sees the
discount reflected in the price summary and on the deposit button before paying.

## Behavior

### Field placement
- New `Promotion code` text input + `Apply` button, placed inside the sticky
  price summary on the right side of `BookingForm`, **between the deposit/balance
  block and the consent fieldset**.
- After apply: input becomes read-only, button switches to `Remove`.

### Code validation
- One valid code: `TDF26`. Case-insensitive (`code.trim().toUpperCase() === 'TDF26'`).
- Invalid → red helper text under input: `Invalid promotion code`. Apply is a
  no-op; price summary and deposit button remain unchanged.
- Empty input → Apply button disabled.

### Money math (critical detail)
"Discount applies to deposit" means the **rider's out-of-pocket today** drops by
$500. Naively reducing only the deposit would push the same $500 into the
balance, which is not a real discount. So:

- `total -= $500`
- `deposit -= $500` (i.e., $1,700 → $1,200)
- `balance = total - deposit` (unchanged from no-promo case)

Worked example (bike rental + shared room):

| Field   | No promo | With TDF26 |
| ------- | -------- | ---------- |
| Total   | $3,990   | $3,490     |
| Deposit | $1,700   | $1,200     |
| Balance | $2,290   | $2,290     |

### Price summary changes (when applied)
- New line inside the subtotal group (after base fee / bike / private room,
  before `Total`): `Promotion (TDF26)` with `−$500` in accent color.
- `Total`, `Deposit`, `Balance` values reflect discounted math.
- Pay-deposit button: `Pay deposit — $1,200`.

## File changes

### `src/lib/stripe.ts`
- Add `PROMO_CODES: Record<string, number>` mapping code → discount in cents:
  `{ TDF26: 50000 }`.
- Add `getPromoDiscount(code?: string): number` — returns cents to discount, or
  0 for empty/invalid. Case-insensitive, trims whitespace.
- Extend `calculateTotal({ bikeRental, privateRoom, promoCode? })` to subtract
  the discount from the returned total.
- Extend `BookingOptions` type with `promoCode?: string`.

### `src/components/BookingForm.tsx`
- New state: `promoCodeInput: string`, `appliedPromoCode: string | null`,
  `promoError: boolean`.
- Inline `Apply` handler: validates against `getPromoDiscount`; if discount > 0,
  sets `appliedPromoCode` and clears error; else sets `promoError = true`.
- `Remove` handler: clears `appliedPromoCode` and the input.
- Recompute `total`, `deposit`, `balance` with the applied code.
- POST body includes `promoCode: appliedPromoCode` (or omits it).

### `src/app/api/stripe/checkout/route.ts`
- Read `promoCode` from body; **re-run** `getPromoDiscount` server-side. The
  client value is never trusted for pricing.
- `unit_amount = PRICING.DEPOSIT - discount` (defaults to PRICING.DEPOSIT when
  no/invalid code).
- Update line item `description`: append `(Promotion TDF26 −$500 applied)` when
  applicable.
- Add Stripe `metadata.promo_code = appliedCode || ''`.
- Recompute `balance_cents` consistently with the discounted total.

### `messages/{en,ko,es}.json`
Add under `book`:
```
"promo": {
  "label": "Promotion code",
  "placeholder": "Enter code",
  "apply": "Apply",
  "remove": "Remove",
  "applied": "Promotion ({code})",
  "invalid": "Invalid promotion code"
}
```
Korean wording follows existing site tone (natural Korean, not literal English).
Spanish copy mirrors Augusto/Rodrigo voice elsewhere in `es.json`.

## Edge cases

- **Code submitted via raw POST without UI**: server re-validates → discount
  applied correctly regardless of where it came from.
- **Code applied, then user toggles bike rental / private room**: discount
  persists. Math recomputes automatically (state for code is independent).
- **Whitespace / lowercase input**: handled by normalization in
  `getPromoDiscount`.
- **Server-side discount mismatch with client**: server is source of truth;
  Stripe always charges the server-computed amount. UI shows pre-flight number;
  if user tampers with client state, they pay server's number (which is correct).

## Out of scope (YAGNI)

- Stripe `Coupon`/`Promotion Code` objects (overkill for one hardcoded code).
- Per-email or per-session usage limits.
- Expiration dates (this code is valid for the founding-member window only;
  hard removal happens by code edit when promo ends).
- Admin UI for managing codes.
- Analytics events specifically for promo redemption (deferred until needed).

## Test plan

- Manual: open `/book`, fill required fields, try the following codes:
  `TDF26`, `tdf26`, ` TDF26 `, `WRONG`, empty → verify summary, button text,
  helper messages.
- Manual: apply code, toggle bike rental + private room, confirm math.
- Manual: complete Stripe checkout with code applied; confirm Stripe Dashboard
  shows $1,200 deposit and `promo_code: TDF26` in session metadata.
- Manual: confirm balance reminder copy (existing `depositNote`) still reads
  correctly with discounted balance.
