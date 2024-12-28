import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST!, {
  apiVersion: "2024-11-20.acacia",
  typescript: true
});

export async function POST(req: NextRequest) {
  console.log('Webhook endpoint hit!');
  
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_CONSOLE;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing stripe signature or webhook secret' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const chunks = [];
    const reader = req.body?.getReader();
    if (!reader) throw new Error('No request body');
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    
    const body = Buffer.concat(chunks).toString('utf8');
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: Error | unknown) {
    console.error("Webhook signature verification failed:", (err as Error).message);
    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Processing checkout session:", session.id);

      // Get product details
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      let productName = 'Unknown';
      let priceId = '';

      if (lineItems.data.length > 0) {
        priceId = lineItems.data[0].price?.id || '';
        if (priceId) {
          const price = await stripe.prices.retrieve(priceId);
          const product = await stripe.products.retrieve(price.product as string);
          productName = product.name;
          console.log("Product Name:", productName);
        }
      }

      const db = getFirestore();
      try {
        console.log("Attempting to save to Firestore...");
        await db.collection('stripedata').doc(session.id).set({
          customerId: session.customer,
          customerEmail: session.customer_email,
          subscriptionStatus: 'active',
          tier: productName,
          priceId: priceId,
          createdAt: new Date(),
          updatedAt: new Date(),
          sessionId: session.id,
          amount: session.amount_total,
          currency: session.currency,
          productDetails: {
            name: productName,
            priceId: priceId
          }
        });
        console.log("Successfully saved to Firestore!");
      } catch (dbError) {
        console.error("Firestore save error:", dbError);
        throw dbError;
      }

      return NextResponse.json({ 
        message: "Subscription processed and saved successfully",
        sessionId: session.id,
        productName: productName
      });
    } else {
      console.log(`Unhandled event type: ${event.type}`);
      return NextResponse.json({ message: "Unhandled event type" }, { status: 200 });
    }
  } catch (err: Error | unknown) {
    console.error("Error processing webhook:", (err as Error).message);
    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
