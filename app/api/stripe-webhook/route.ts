import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import axios from 'axios';

// Change this initialization to check for required env vars
if (!process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY || 
    !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
    !process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL) {
  throw new Error('Missing required Firebase environment variables');
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true
});

async function notifyDiscordPayment(session: Stripe.Checkout.Session, productName: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL_MONEY;
  if (!webhookUrl) return;

  try {
    const message = {
      username: 'DATAx Money Bot',
      embeds: [{
        title: '💰 New Payment Received!',
        color: 0x00ff00,
        fields: [
          {
            name: 'Product',
            value: productName,
            inline: true
          },
          {
            name: 'Amount',
            value: `$${(session.amount_total! / 100).toFixed(2)} ${session.currency?.toUpperCase()}`,
            inline: true
          },
          {
            name: 'Customer',
            value: session.customer_email || 'No email provided',
            inline: true
          }
        ],
        timestamp: new Date().toISOString()
      }]
    };

    await axios.post(webhookUrl, message);
  } catch (error) {
    console.error('Failed to send Discord payment notification:', error);
    // Don't throw - we don't want to interrupt payment processing if notification fails
  }
}

async function handleNewSubscription(session: Stripe.Checkout.Session) {
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

  await notifyDiscordPayment(session, productName);

  const db = getFirestore();
  await db.collection('stripedata').doc(session.id).set({
    orgID: session.metadata?.orgID || '',
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
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const db = getFirestore();
  
  const price = await stripe.prices.retrieve(subscription.items.data[0].price.id);
  const product = await stripe.products.retrieve(price.product as string);

  // Find the existing subscription document
  const querySnapshot = await db.collection('stripedata')
    .where('customerId', '==', subscription.customer)
    .limit(1)
    .get();

  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref;
    await docRef.update({
      subscriptionStatus: subscription.status,
      tier: product.name,
      priceId: price.id,
      updatedAt: new Date(),
      amount: subscription.items.data[0].price.unit_amount,
      currency: subscription.currency,
      productDetails: {
        name: product.name,
        priceId: price.id
      }
    });
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const db = getFirestore();
  const querySnapshot = await db.collection('stripedata')
    .where('customerId', '==', subscription.customer)
    .limit(1)
    .get();

  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref;
    await docRef.update({
      subscriptionStatus: 'cancelled',
      updatedAt: new Date(),
    });
  }
}

async function handleFailedPayment(invoice: Stripe.Invoice) {
  const db = getFirestore();
  const querySnapshot = await db.collection('stripedata')
    .where('customerId', '==', invoice.customer)
    .limit(1)
    .get();

  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref;
    await docRef.update({
      subscriptionStatus: 'past_due',
      updatedAt: new Date(),
      lastFailedPayment: new Date(),
    });
  }
}

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
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        await handleNewSubscription(session);
        return NextResponse.json({ 
          message: "New subscription processed successfully",
          sessionId: session.id
        });

      case "customer.subscription.updated":
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        return NextResponse.json({ 
          message: "Subscription updated successfully"
        });

      case "customer.subscription.deleted":
        const cancelledSub = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancellation(cancelledSub);
        return NextResponse.json({ 
          message: "Subscription cancelled successfully"
        });

      case "invoice.payment_failed":
        const invoice = event.data.object as Stripe.Invoice;
        await handleFailedPayment(invoice);
        return NextResponse.json({ 
          message: "Failed payment handled successfully"
        });

      default:
        console.log(`Unhandled event type: ${event.type}`);
        return NextResponse.json({ 
          message: "Unhandled event type" 
        }, { status: 200 });
    }
  } catch (err: Error | unknown) {
    console.error("Error processing webhook:", (err as Error).message);
    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
