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
  BASE_FEE: 299000, // $2,990
  DEPOSIT: 130000, // $1,300
  BIKE_RENTAL: 50000, // $500
  PRIVATE_ROOM: 30000, // $300
} as const;

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
  locale: string;
  consents: BookingConsents;
};

export const REQUIRED_CONSENT_KEYS = [
  'waiver',
  'insurance',
  'privacy',
  'cancellation',
] as const;

export function calculateTotal(opts: { bikeRental: boolean; privateRoom: boolean }) {
  let total = PRICING.BASE_FEE;
  if (opts.bikeRental) total += PRICING.BIKE_RENTAL;
  if (opts.privateRoom) total += PRICING.PRIVATE_ROOM;
  return total;
}

export function formatUSD(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(cents / 100);
}
