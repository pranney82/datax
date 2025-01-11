import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST!, {
  apiVersion: '2024-12-18.acacia',
});

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { priceId, uid, email, orgID } = await req.json();

    if (!priceId || !uid || !email || !orgID) {
      return NextResponse.json({ error: 'Price ID, UID, email, and orgID are required' }, { status: 400 });
    }

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        uid: uid,
        orgID: orgID,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/x/settings`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: Error | unknown) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
