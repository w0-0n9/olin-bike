import { NextRequest, NextResponse } from 'next/server';
import {
  getStripe,
  PRICING,
  REQUIRED_CONSENT_KEYS,
  calculateTotal,
  type BookingOptions,
} from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body: BookingOptions = await req.json();
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

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    if (!jerseySize?.trim()) {
      return NextResponse.json({ error: 'Jersey size is required' }, { status: 400 });
    }

    if (bikeRental && (!bikeSize || !pedalType)) {
      return NextResponse.json({ error: 'Bike size and pedal type required for rental' }, { status: 400 });
    }

    // GDPR: re-verify required consents server-side. Client-side gating is UX,
    // not enforcement.
    if (!consents || REQUIRED_CONSENT_KEYS.some((key) => !consents[key])) {
      return NextResponse.json(
        { error: 'All required consents must be confirmed before payment.' },
        { status: 400 },
      );
    }
    if (!consents.at || Number.isNaN(Date.parse(consents.at))) {
      return NextResponse.json({ error: 'Missing consent timestamp.' }, { status: 400 });
    }

    const total = calculateTotal({ bikeRental, privateRoom });
    const balance = total - PRICING.DEPOSIT;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Olin TDF 2026 — Deposit',
              description: `Founding member deposit for Tour de France 2026 experience (July 21–26). Total: $${total / 100}. Balance of $${balance / 100} due 30 days before departure.`,
            },
            unit_amount: PRICING.DEPOSIT,
          },
          quantity: 1,
        },
      ],
      metadata: {
        booking_name: name,
        booking_email: email,
        booking_phone: phone,
        bike_rental: bikeRental ? 'yes' : 'no',
        bike_size: bikeSize || '',
        pedal_type: pedalType || '',
        jersey_size: jerseySize.slice(0, 200),
        private_room: privateRoom ? 'yes' : 'no',
        total_cents: total.toString(),
        balance_cents: balance.toString(),
        locale,
        // GDPR consent audit trail. Each required consent is persisted with
        // the same submit-time ISO timestamp; optional consents are stamped
        // only when given. The Stripe checkout session id ties them together.
        consent_waiver_at: consents.waiver ? consents.at : '',
        consent_insurance_at: consents.insurance ? consents.at : '',
        consent_privacy_at: consents.privacy ? consents.at : '',
        consent_cancellation_at: consents.cancellation ? consents.at : '',
        consent_feedback_at: consents.feedback ? consents.at : '',
        consent_media_at: consents.media ? consents.at : '',
        consent_user_agent: (req.headers.get('user-agent') || '').slice(0, 500),
        consent_ip:
          req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
          req.headers.get('x-real-ip') ||
          '',
        consent_policy_version: '2026-05-09',
      },
      success_url: `${siteUrl}/${locale}/book/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${locale}/book`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    );
  }
}
