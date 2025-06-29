import Stripe from 'stripe';
import AppError from '../../errors/AppError';
import { prisma } from '../../prisma/client';
import { IUser } from '../User/user.interface';
import { getMonth } from 'date-fns';
import { sendEmail } from '../../utils/sendEmail';
import stripe from '../../config/stripe';
import { Plan } from '@prisma/client';

const createSubscriptionSession = async (user: IUser, plan: Plan) => {

    if (!user.id) {
        throw new AppError(400, 'User ID is required to create a subscription');
    }
    let existingSubscription = await prisma.subscription.findFirst({
        where: {
            userId: user.id,
            planId: plan.id,
        },
    });

    if (
        existingSubscription &&
        existingSubscription.isActive &&
        existingSubscription.subscriptionStatus === 'PAID'
    ) {
        throw new AppError(400, 'You already have an active subscription');
    }
    const priceId = plan.stripePriceId as string;

    const result = await prisma.$transaction(async (TX) => {
        if (!existingSubscription) {
            existingSubscription = await TX.subscription.create({
                data: {
                    userId: user?.id as string,
                    planId: plan.id,
                    isActive: true,
                    subscriptionStatus: 'PENDING',
                    startDate: new Date(),
                    endDate: new Date(),
                },
            });
        }

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
            customer_email: user.email,
            client_reference_id: user.id,
            allow_promotion_codes: true,
            metadata: {
                userId: user.id as string,
                userName: user.name,
                userEmail: user.email,
                planName: plan.productName,
                subscriptionId: existingSubscription?.id || 'unknown',
                duration: plan.Duration?.toString() || '1',
            },
            subscription_data: {
                metadata: {
                    subscriptionId: existingSubscription?.id || 'unknown',
                    userId: user.id as string,
                    userName: user.name,
                    userEmail: user.email,
                    planName: plan.productName,
                    duration: plan.Duration?.toString() || '1',
                },
            },
        };


        const session = await stripe.checkout.sessions.create(sessionParams);
        return session;
    });

    return {
        sessionURL: result.url,
        successURL: result.success_url,
        cancelURL: result.cancel_url,
    };
};

// export const handleCheckoutSessionCompleted = async (session: any) => {
//   const userId = session.metadata?.userId;
//   const planId = session.metadata?.planId;
//   const priceId = session.metadata?.priceId;
//   const coustomer_name = session.metadata?.userName;
//   const amount = session.amount_total / 100; // Convert cents to dollars
//   const currency = session.currency.toUpperCase();

//   if (!userId || !planId || !priceId) {
//     throw new Error('Missing required metadata in session');
//   }

//   const stripeSubscription = await stripe.subscriptions.retrieve(
//     session.subscription as string,
//   );

//   const startDate = new Date(stripeSubscription.start_date * 1000);

//   const intervalCount =
//     stripeSubscription.items.data[0].price.recurring?.interval_count ?? 1;

//   const endDate = new Date(startDate);
//   endDate.setMonth(endDate.getMonth() + intervalCount);

//   const status =
//     stripeSubscription.status === 'trialing'
//       ? 'TRIAL'
//       : stripeSubscription.status === 'active'
//         ? 'PAID'
//         : 'PENDING';



//   // Create new subscription entry (not upsert, since users can have multiple now)
//   const subscription = await prisma.subscription.create({
//     data: {
//       userId,
//       planId,
//       stripeSessionId: session.id,
//       stripeSubscriptionId: stripeSubscription.id,
//       stripeCustomerId: session.customer as string,
//       startDate,
//       endDate,
//       subscriptionStatus: status,
//       isActive: status === 'PAID' || status === 'TRIAL',
//     },
//   });

//   // Create a new payment record in the database
//   const payment = await prisma.payment.create({
//     data: {
//       subscriptionId: subscription.id,
//       invoiceNumber: '',
//       name: coustomer_name,
//       amount,
//       currency,
//       status: 'PENDING',
//     },
//   });

//   if (!subscription) {
//     throw new AppError(500, 'Failed to create subscription');
//   }
// };

const handleInvoicePaymentSucceeded = async (invoice: Stripe.Invoice) => {

    const stripeSubscriptionId = invoice.parent?.subscription_details
        ?.subscription as string;
    const stripeubscription =
        await stripe.subscriptions.retrieve(stripeSubscriptionId);
    const subscriptionId =
        invoice.parent?.subscription_details?.metadata?.subscriptionId;
    const duration = invoice.parent?.subscription_details?.metadata?.duration;
    const userId = invoice?.parent?.subscription_details?.metadata?.userId;

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })


    if (!subscriptionId) {
        console.error('❌ Stripe subscription ID not found in invoice metadata');
        return;
    }

    const amount = invoice.amount_paid / 100;
    const currency = invoice.currency.toUpperCase();

    const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
    });

    if (!subscription) {
        console.error(
            `❌ Subscription not found for Subscription ID: ${subscriptionId}`,
        );
        return;
    }

    const transaction = await prisma.$transaction(async (TX) => {

        //update payment
        const payment = await TX.payment.create({
            data: {
                subscriptionId: subscriptionId,
                name: invoice?.customer_name,
                amount,
                currency,
                invoiceNumber: invoice.number,
                status: 'SUCCEEDED',
            },
        });

        //update subscription info
        const subscription = await TX.subscription.update({
            where: { id: subscriptionId },
            data: {
                subscriptionStatus: 'PAID',
                startDate: new Date(),
                endDate: new Date(
                    new Date().setMonth(
                        new Date().getMonth() +
                        (duration ? Number(duration) : new Date().getMonth()),
                    ),
                ),
                stripeSubscriptionId: stripeSubscriptionId,

            },
        });

        if (!payment) {
            throw new AppError(500, 'Failed to create payment record');
        }


        const invoicePdfUrl = invoice?.hosted_invoice_url;
        const htmlContent = `
  <h2>Payment Successful 🎉</h2>
  <p>You can download your invoice here:</p>
  <a href="${invoicePdfUrl}" target="_blank">Download Invoice PDF</a>
  <hr />
  <iframe src="${invoicePdfUrl}" width="100%" height="600px" style="border:none;"></iframe>
`;

        const result = await sendEmail(
            [{ email: user?.email as string }],
            'You have Successfully Buy Your Subscription',
            htmlContent
        )

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

export const handleSubscriptionUpdated = async (event: Stripe.Event) => {
    console.log('✅ Customer subscription updated webhook triggered');

    const stripeSubscription = event.data.object as Stripe.Subscription;
    const subscriptionId = stripeSubscription.id;

    // Get the latest subscription data from Stripe
    const latestSubscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Get subscription from DB using Stripe subscription ID
    const dbSubscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subscriptionId },
    });

    if (!dbSubscription) {
        console.warn(`⚠️ Subscription not found in DB for Stripe ID: ${subscriptionId}`);
        return;
    }

    // Get user linked to the subscription
    const user = await prisma.user.findUnique({
        where: { id: dbSubscription.userId },
    });

    const {
        status,
        canceled_at: canceledAtUnix,
        cancel_at_period_end: cancelAtPeriodEnd,
        cancel_at: cancelAtUnix,
        ended_at: endedAtUnix,
        current_period_end: currentPeriodEndUnix,
    } = latestSubscription as any;

    // Prepare status values for DB
    let subscriptionStatus: 'PENDING' | 'PAID' | 'CANCELLED';
    let isActive = false;
    let endDate: Date | null = null;

    if (endedAtUnix) {
        endDate = new Date(endedAtUnix * 1000);

        // Create customer portal session for renewal
        const session = await stripe.billingPortal.sessions.create({
            customer: latestSubscription.customer as string,
            return_url: 'https://ruebzj-frontend.vercel.app/stripe/success',
        });

        const renewUrl = session.url;

        // Prepare HTML email content
        const htmlContent = `
      <h2 style="color: #e11d48;">Your Subscription Has Ended</h2>
      <p>Hi there,</p>
      <p>We wanted to let you know that your subscription has ended as of <strong>${endDate.toLocaleDateString()}</strong>.</p>
      <p>If this was unexpected or you'd like to renew your subscription, you can do so using the button below:</p>
      <a href="${renewUrl}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px;">Renew Subscription</a>
      <hr />
      <p style="font-size: 14px; color: #666;">If you have any questions, feel free to contact our support team.</p>
    `;

        if (user?.email) {
            await sendEmail(
                [{ email: user.email }],
                'Your Subscription Period has Ended',
                htmlContent
            );
            console.log(`📧 Sent renewal email to ${user.email}`);
        }

        subscriptionStatus = 'CANCELLED';
        isActive = false;

    } else if (cancelAtPeriodEnd) {
        subscriptionStatus = 'PAID';
        isActive = true;
        endDate = new Date(currentPeriodEndUnix * 1000);

    } else if (status === 'active' || status === 'trialing') {
        subscriptionStatus = 'PAID';
        isActive = true;
        endDate = new Date(currentPeriodEndUnix * 1000);

    } else {
        subscriptionStatus = 'PENDING';
        isActive = false;
        endDate = null;
    }

    // Update subscription in the DB
    await prisma.subscription.update({
        where: { id: dbSubscription.id },
        data: {
            subscriptionStatus,
            isActive,
            endDate: endDate!,
        },
    });

    console.log(`🔄 Updated subscription ${dbSubscription.id} in DB with status "${subscriptionStatus}"`);
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


//get all subscribers

const allsubscribers = async () => {
    const res = await prisma.$runCommandRaw({
        aggregate: 'shops',
        pipeline: [
            {
                $group: {
                    _id: '$userId',
                    shopCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    userId: '$_id',
                    shopCount: 1,
                    _id: 0,
                },
            },
        ],
        cursor: {},
    });

    const mongoRes = res as { cursor?: { firstBatch?: any[] } };
    const formatted = mongoRes?.cursor?.firstBatch?.map((entry: any) => ({
        userId: entry.userId.$oid || entry.userId,
        shops: entry.shopCount
    }));
    const result = prisma.subscription.findMany({
        distinct: ['userId'], // move here
        select: {
            plan: true,
            user: true
        }
    });

    return {
        result: await result,
        formatted
    };
};

//update product and subscription plan 

const updateSubscription = async (price: number, productId: string) => {
    const newPrice = await stripe.prices.create({
        unit_amount: Math.round(price * 100),
        currency: 'usd',
        product: productId,
    });

    let updatedData;
    if (newPrice) {
        const data = await prisma.plan.updateMany(
            {
                where: {
                    productId: productId as string
                },
                data: {
                    productPrice: price,
                }
            }
        )
        updatedData = data;
    }

    return updatedData;
}



export const SubscriptionService = {
    createSubscriptionSession,
    handleInvoicePaymentSucceeded,
    deleteSubscription,
    handleInvoicePaymentFailed,
    handleSubscriptionWillEnd,
    handleSubscriptionUpdated,
    allsubscribers,
    updateSubscription
};