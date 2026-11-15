import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

const MAX_SIGNATURE_AGE_SECONDS = 300; // 5 minutes replay window

function verifyPaddleSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(';').map((part) => {
      const idx = part.indexOf('=');
      if (idx === -1) return ['', ''];
      return [part.slice(0, idx).trim(), part.slice(idx + 1).trim()];
    })
  );

  const ts = parts.ts;
  const h1 = parts.h1;
  if (!ts || !h1 || !/^\d+$/.test(ts) || !/^[0-9a-f]+$/i.test(h1)) {
    return false;
  }

  const tsSeconds = Number(ts);
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSeconds - tsSeconds) > MAX_SIGNATURE_AGE_SECONDS) {
    return false;
  }

  const expectedHex = crypto
    .createHmac('sha256', secret)
    .update(`${ts}:${rawBody}`, 'utf8')
    .digest('hex');

  const expectedBuf = Buffer.from(expectedHex, 'hex');
  const receivedBuf = Buffer.from(h1, 'hex');
  if (expectedBuf.length !== receivedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Paddle webhook rejected: PADDLE_WEBHOOK_SECRET is not configured.');
      return NextResponse.json(
        { error: 'Webhook verification not configured' },
        { status: 503 }
      );
    }

    const rawBody = await req.text();
    const signatureHeader = req.headers.get('paddle-signature');

    if (!verifyPaddleSignature(rawBody, signatureHeader, webhookSecret)) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const eventType = body.event_type || body.alert_name;
    const data = body.data || body;

    console.log(`Verified Paddle webhook event: ${eventType}`);

    const rawEmail = data.user_email || data.email || data.custom_data?.email;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
    const customerId = data.customer_id || data.p_customer_id;
    const subscriptionId = data.subscription_id || data.p_subscription_id;

    if (!email) {
      return NextResponse.json({ message: 'Event logged without email' }, { status: 200 });
    }

    switch (eventType) {
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription.created':
      case 'subscription.updated':
        await prisma.user.upsert({
          where: { email },
          update: {
            tier: 'PRO_MONTHLY',
            paddleCustomerId: customerId ? String(customerId) : undefined,
            subscriptionId: subscriptionId ? String(subscriptionId) : undefined,
          },
          create: {
            email,
            tier: 'PRO_MONTHLY',
            paddleCustomerId: customerId ? String(customerId) : undefined,
            subscriptionId: subscriptionId ? String(subscriptionId) : undefined,
          },
        });
        break;

      case 'subscription_cancelled':
      case 'subscription.canceled':
        await prisma.user.updateMany({
          where: { email },
          data: {
            tier: 'FREE',
            subscriptionId: null,
          },
        });
        break;

      case 'transaction_completed':
      case 'transaction.completed':
        if (data.items?.[0]?.price?.name?.toLowerCase().includes('lifetime')) {
          await prisma.user.upsert({
            where: { email },
            update: {
              tier: 'LIFETIME',
              paddleCustomerId: customerId ? String(customerId) : undefined,
            },
            create: {
              email,
              tier: 'LIFETIME',
              paddleCustomerId: customerId ? String(customerId) : undefined,
            },
          });
        }
        break;

      default:
        console.log(`Unhandled Paddle event: ${eventType}`);
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error handling Paddle webhook:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
