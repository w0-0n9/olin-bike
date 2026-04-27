import { NextRequest, NextResponse } from 'next/server';
import { getStripe, PRICING, calculateTotal, type BookingOptions } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body: BookingOptions = await req.json();
    const { name, email, phone, bikeRental, bikeSize, pedalType, privateRoom, locale } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    if (bikeRental && (!bikeSize || !pedalType)) {
      return NextResponse.json({ error: 'Bike size and pedal type required for rental' }, { status: 400 });
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
        private_room: privateRoom ? 'yes' : 'no',
        total_cents: total.toString(),
        balance_cents: balance.toString(),
        locale,
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
