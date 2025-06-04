import Stripe from 'stripe';
import AppError from '../../errors/AppError';
import stripe from '../../helpers/stripe';
import { prisma } from '../../prisma/client';
import { IUser } from '../User/user.interface';

const createSubscriptionSession = async (user: IUser, planName: string) => {
  const plan = await prisma.plan.findUnique({
    where: { name: planName },
  });
  const activeSubscription = await prisma.subscription.findFirst({
    where: { userId: user.id, isActive: true },
  });

  if (activeSubscription) {
    throw new AppError(400, 'You already have an active subscription');
  }

  if (!plan) {
    throw new AppError(404, 'Plan not found');
  }

  const priceId = plan.stripePriceId;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.CLIENT_URL}/stripe/success`,
    cancel_url: `${process.env.CLIENT_URL}/stripe/cancel`,
    client_reference_id: user.id,
    customer_email: user.email,
    allow_promotion_codes: true,
    metadata: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      planName: plan.name,
      planId: plan.id,
      priceId: plan.stripePriceId,
    },
  });

  return {
    sessionURL: session.url,
    successURL: session.success_url,
    cancelURL: session.cancel_url,
  };
};

export const handleCheckoutSessionCompleted = async (session: any) => {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;
  const priceId = session.metadata?.priceId;

  if (!userId || !planId || !priceId) {
    throw new Error('Missing required metadata in session');
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    session.subscription as string,
  );

  const startDate = new Date(stripeSubscription.start_date * 1000);

  const intervalCount =
    stripeSubscription.items.data[0].price.recurring?.interval_count ?? 1;

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + intervalCount);

  const status =
    stripeSubscription.status === 'trialing'
      ? 'TRIAL'
      : stripeSubscription.status === 'active'
        ? 'PAID'
        : 'PENDING';

  // Create new subscription entry (not upsert, since users can have multiple now)
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      planId,
      stripeSessionId: session.id,
      stripeSubscriptionId: stripeSubscription.id,
      stripeCustomerId: session.customer as string,
      startDate,
      endDate,
      subscriptionStatus: status,
      isActive: status === 'PAID' || status === 'TRIAL',
    },
  });

  if (!subscription) {
    throw new AppError(500, 'Failed to create subscription');
  }
};

const handleInvoicePaymentSucceeded = async (invoice: any) => {
  console.log('✅ Invoice payment succeeded webhook triggered');

  const invoiceNumber = invoice.number;
  const stripeSubscriptionId =
    invoice.parent?.subscription_details?.subscription || invoice.subscription;

  if (!stripeSubscriptionId) {
    console.error('❌ Stripe subscription ID not found in invoice');
    return;
  }

  if (!invoiceNumber) {
    console.error('❌ Invoice number not found in invoice');
    return;
  }

  const amount = invoice.amount_paid / 100;
  const currency = invoice.currency.toUpperCase();

  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId },
  });

  if (!subscription) {
    console.error(
      `❌ Subscription not found for Stripe ID: ${stripeSubscriptionId}`,
    );
    return;
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { invoiceNumber },
  });

  if (existingPayment) {
    console.log(
      `⚠️ Payment with invoice number ${invoiceNumber} already exists. Skipping.`,
    );
    return;
  }

  // Create a new payment record in the database
  const payment = await prisma.payment.create({
    data: {
      subscriptionId: subscription.id,
      invoiceNumber,
      name: invoice.customer_name,
      amount,
      currency,
      status: 'SUCCEEDED',
    },
  });
};

const deleteSubscription = async (event: Stripe.Event) => {
  console.log('✅ Customer subscription deleted webhook triggered');

  const stripeSubscription = event.data.object as Stripe.Subscription;
  const subscriptionDeleteId = stripeSubscription.id;
  const canceledAtUnix = stripeSubscription.canceled_at;

  console.log('status', stripeSubscription.status);
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionDeleteId },
    include: {
      user: true,
    },
  });

  if (!dbSubscription) {
    console.warn(
      '⚠️ Subscription not found in database for ID:',
      subscriptionDeleteId,
    );
    return;
  }

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      isActive: false,
      subscriptionStatus: 'CANCELLED',
      endDate: canceledAtUnix ? new Date(canceledAtUnix * 1000) : new Date(),
    },
  });

  console.log(`✅ Subscription ${dbSubscription.id} marked as CANCELLED.`);
};

// const handleSubscriptionUpdated = async (event: Stripe.Event) => {
//   console.log('✅ Customer subscription updated webhook triggered');

//   const stripeSubscription = event.data.object as Stripe.Subscription;
//   const subscriptionId = stripeSubscription.id;

//   // Fetch latest subscription data from Stripe to avoid stale info
//   const latestSubscription =
//     await stripe.subscriptions.retrieve(subscriptionId);

//   const status = latestSubscription.status; // reliable current status
//   const canceledAtUnix = latestSubscription.canceled_at;
//   const currentPeriodEndUnix = (latestSubscription as any).current_period_end;

//   // console.log('Latest subscription status:', latestSubscription);

//   // Find subscription in DB
//   const dbSubscription = await prisma.subscription.findUnique({
//     where: { stripeSubscriptionId: subscriptionId },
//   });

//   if (!dbSubscription) {
//     console.warn(
//       `⚠️ Subscription not found in DB for Stripe ID: ${subscriptionId}`,
//     );
//     return;
//   }

//   const updateData: any = {
//     subscriptionStatus: latestSubscription.cancel_at_period_end
//       ? 'CANCELLED'
//       : 'PAID',
//     isActive: latestSubscription.cancel_at_period_end ? false : true,
//   };

//   if (canceledAtUnix) {
//     updateData.endDate = new Date(canceledAtUnix * 1000);
//   } else if (currentPeriodEndUnix) {
//     updateData.endDate = new Date(currentPeriodEndUnix * 1000);
//   }

//   const updated = await prisma.subscription.update({
//     where: { id: dbSubscription.id },
//     data: updateData,
//   });

//   console.log(
//     `✅ Subscription ${dbSubscription.id} updated with status ${status}`,
//   );
// };

export const handleSubscriptionUpdated = async (event: Stripe.Event) => {
  console.log('✅ Customer subscription updated webhook triggered');

  const stripeSubscription = event.data.object as Stripe.Subscription;
  const subscriptionId = stripeSubscription.id;

  // Get freshest subscription data from Stripe
  const latestSubscription =
    await stripe.subscriptions.retrieve(subscriptionId);

  const {
    status,
    canceled_at: canceledAtUnix,
    cancel_at_period_end: cancelAtPeriodEnd,
    cancel_at: cancelAtUnix,
    ended_at: endedAtUnix,
    current_period_end: currentPeriodEndUnix,
  } = latestSubscription as any;

  // Find subscription in DB
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!dbSubscription) {
    console.warn(
      `⚠️ Subscription not found in DB for Stripe ID: ${subscriptionId}`,
    );
    return;
  }

  // Map Stripe status to your backend status
  // Your statuses: PENDING, PAID, CANCELLED
  let subscriptionStatus: 'PENDING' | 'PAID' | 'CANCELLED' = 'PENDING';
  let isActive = false;
  let endDate: Date | null = null;

  if (endedAtUnix) {
    // Subscription ended fully -> CANCELLED
    subscriptionStatus = 'CANCELLED';
    isActive = false;
    endDate = new Date(endedAtUnix * 1000);
  } else if (cancelAtPeriodEnd) {
    // Cancel at period end requested, still active now
    subscriptionStatus = 'PAID';
    isActive = true;
    endDate = cancelAtUnix ? new Date(cancelAtUnix * 1000) : null;
  } else if (status === 'active' || status === 'trialing') {
    subscriptionStatus = 'PAID';
    isActive = true;
    endDate = currentPeriodEndUnix
      ? new Date(currentPeriodEndUnix * 1000)
      : null;
  } else if (status === 'canceled' && !endedAtUnix) {
    // Immediately canceled
    subscriptionStatus = 'CANCELLED';
    isActive = false;
    endDate = canceledAtUnix ? new Date(canceledAtUnix * 1000) : null;
  } else {
    // Other cases like past_due, unpaid, incomplete etc.
    subscriptionStatus = 'PENDING';
    isActive = false;
    endDate = currentPeriodEndUnix
      ? new Date(currentPeriodEndUnix * 1000)
      : null;
  }

  const updateData: any = {
    isActive,
    subscriptionStatus,
  };
  if (endDate !== null) {
    updateData.endDate = endDate;
  }

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: updateData,
  });

  console.log(
    `✅ Subscription ${dbSubscription.id} updated with status ${subscriptionStatus}`,
  );
};

const handleInvoicePaymentFailed = async (event: Stripe.Event) => {
  console.log('⚠️ Invoice payment failed webhook triggered');

  const invoice = event.data.object as Stripe.Invoice;
  const userId = invoice.metadata?.userId;

  if (!userId) {
    console.warn('⚠️ No userId found in invoice metadata');
    return;
  }

  const dbSubscription = await prisma.subscription.findFirst({
    where: { userId },
  });

  if (!dbSubscription) {
    console.warn(`⚠️ No subscription found for user ID: ${userId}`);
    return;
  }

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      subscriptionStatus: 'CANCELLED',
      isActive: false,
      endDate: new Date(),
    },
  });

  console.log(
    `🚫 Subscription for user ${userId} marked as CANCELLED due to payment failure.`,
  );
};

const handleSubscriptionWillEnd = async (event: Stripe.Event) => {
  console.log('Subscription will end');
};

export const SubscriptionService = {
  createSubscriptionSession,
  handleCheckoutSessionCompleted,
  handleInvoicePaymentSucceeded,
  deleteSubscription,
  handleInvoicePaymentFailed,
  handleSubscriptionWillEnd,
  handleSubscriptionUpdated,
};
