import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      throw new Error(
        'STRIPE_SECRET_KEY is not set. Add it to .env.local — see .env.example.',
      );
    }
    // Omit apiVersion so the Stripe SDK uses the version pinned on your account.
    _stripe = new Stripe(secret, { typescript: true });
  }
  return _stripe;
}

// Pricing in cents (USD)
export const PRICING = {
  BASE_FEE: 349000, // $3,490
  DEPOSIT: 170000, // $1,700
  BIKE_RENTAL: 50000, // $500
  PRIVATE_ROOM: 110000, // $1,100 — priced to disincentivise solo rooms
                       //          and cover the bed-gap they create.
} as const;

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

export const BIKE_SIZES = ['48', '50', '52', '54', '56', '58'] as const;
export const PEDAL_TYPES = ['SPD-SL', 'SPD', 'Look Keo', 'Flat'] as const;

export type BikeSize = (typeof BIKE_SIZES)[number];
export type PedalType = (typeof PEDAL_TYPES)[number];

// GDPR consent shape submitted from the booking form. The four required
// consents must be true before the deposit button is enabled. The two
// optional consents may be false. `at` is an ISO timestamp captured client-side
// at submit time, persisted into Stripe metadata so each consent is auditable
// against the resulting checkout session.
export type BookingConsents = {
  waiver: boolean;
  insurance: boolean;
  privacy: boolean;
  cancellation: boolean;
  feedback: boolean;
  media: boolean;
  at: string;
};

export type BookingOptions = {
  name: string;
  email: string;
  phone: string;
  bikeRental: boolean;
  bikeSize?: BikeSize;
  pedalType?: PedalType;
  privateRoom: boolean;
  // Free-text jersey sizing — every founding member receives a jersey,
  // so this is required. Free text (rather than a select) lets riders
  // describe brand-specific fits or chest measurements.
  jerseySize: string;
  locale: string;
  promoCode?: string;
  consents: BookingConsents;
};

export const REQUIRED_CONSENT_KEYS = [
  'waiver',
  'insurance',
  'privacy',
  'cancellation',
] as const;

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

export function formatUSD(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(cents / 100);
}
