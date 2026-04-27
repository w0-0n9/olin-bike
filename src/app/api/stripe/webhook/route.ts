import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  try {
    const event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const meta = session.metadata;

        // TODO: Store booking in database (Supabase)
        // TODO: Send confirmation email (Resend)
        console.log('✅ Booking confirmed:', {
          name: meta?.booking_name,
          email: meta?.booking_email,
          bikeRental: meta?.bike_rental,
          privateRoom: meta?.private_room,
          total: meta?.total_cents,
          sessionId: session.id,
        });
        break;
      }
      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }
}
