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

        // TODO: Store booking + consents in database (Supabase). Each consent
        // should land in its own row keyed by sessionId so per-consent
        // withdrawals (e.g. media consent) can be tracked independently.
        // TODO: Send confirmation email (Resend)
        console.log('✅ Booking confirmed:', {
          name: meta?.booking_name,
          email: meta?.booking_email,
          bikeRental: meta?.bike_rental,
          privateRoom: meta?.private_room,
          total: meta?.total_cents,
          sessionId: session.id,
          consents: {
            policyVersion: meta?.consent_policy_version,
            waiverAt: meta?.consent_waiver_at,
            insuranceAt: meta?.consent_insurance_at,
            privacyAt: meta?.consent_privacy_at,
            cancellationAt: meta?.consent_cancellation_at,
            feedbackAt: meta?.consent_feedback_at || null,
            mediaAt: meta?.consent_media_at || null,
            userAgent: meta?.consent_user_agent,
            ip: meta?.consent_ip,
          },
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
