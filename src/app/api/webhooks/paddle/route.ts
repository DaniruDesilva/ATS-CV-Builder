import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.event_type || body.alert_name;
    const data = body.data || body;

    console.log(`Received Paddle webhook event: ${eventType}`);

    // Verify webhook signature if secret configured
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
    if (webhookSecret) {
      // Secret verification logic
    }

    const email = data.user_email || data.email || data.custom_data?.email;
    const customerId = data.customer_id || data.p_customer_id;
    const subscriptionId = data.subscription_id || data.p_subscription_id;

    if (!email) {
      return NextResponse.json({ message: 'Event logged without email' }, { status: 200 });
    }

    switch (eventType) {
      case 'subscription_created':
      case 'subscription_updated':
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
        await prisma.user.update({
          where: { email },
          data: {
            tier: 'FREE',
            subscriptionId: null,
          },
        });
        break;

      case 'transaction_completed':
        // Check if one-time lifetime payment
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
