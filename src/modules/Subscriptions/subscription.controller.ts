
import { prisma } from '../../prisma/client';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotFound } from '../../utils/utility';
import stripe from '../../config/stripe';
import AppError from '../../errors/AppError';

import { sendEmail } from '../../utils/sendEmail';
import { generateEmailTemplate } from './subscription.constans';
import { HttpStatusCode } from 'axios';
import config from '../../config';
import { Request, Response } from 'express';
import { SubscriptionService } from './subscription.service';

//create produc
const CreatePlan = catchAsync(async (req, res) => {
  const {
    amount,
    currency = 'usd',
    interval,
    Duration,
    description,
    licenseId,
  } = req.body;

  if (!interval || !Duration || !description || !licenseId || !amount) {
    throw new AppError(404, 'A field is missing');
  }

  const isExist = await prisma.license.findUnique({
    where: { id: licenseId },
  });

  await NotFound(isExist, 'License does not exist');

  const isAlreadyHavePlan = await prisma.plan.findFirst({
    where: {
      productName: isExist?.name,
      interval,
      Duration,
      licenseId,
    },
  });

  if (isAlreadyHavePlan) {
    throw new Error('Already Created Plan');
  }

  // 🧾 Create Product and Price on Stripe
  const product = await stripe.products.create({
    name: isExist?.name as string,
  });

  const price = await stripe.prices.create({
    unit_amount: amount * 100,
    currency: currency,
    recurring: {
      interval: interval,
      interval_count: Duration || 1,
    },
    product: product.id,
  });

  // 🛡️ Transaction for DB entry
  const result = await prisma.$transaction(async (tx) => {
    const dbPlan = await tx.plan.create({
      data: {
        productName: isExist?.name as string,
        productPrice: amount,
        productId: product.id,
        stripePriceId: price.id,
        interval,
        Duration,
        licenseId,
        productDescription: description,
      },
    });

    return dbPlan;
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Successfully Created Plan',
    Data: result,
  });
});


const AllPlans = catchAsync(async (req, res) => {
  const result = await prisma.plan.findMany({
    select: {
      id: true,
      productName: true,
      productId: true,
      interval: true,
      Duration: true,
      stripePriceId: true,
      license: {
        include: {
         licenseTopics:{
          include:{
             topic: {
            include: {
              questions: {
                include: {
                  bookmarks: true,
                  comments: true
                }
              }
            }
          }
          }
         }
        }
      }
    },
  });


  const isOk = result.length > 0 ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk ? 'Successfully Retrived All Plans' : 'Failed to Get  Plans',
    Data: isOk ? result : [],
  });
});
const SinglePlan = catchAsync(async (req, res) => {
  const result = await prisma.plan.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      stripePriceId: true,
      productName: true,
      productId: true,
      interval: true,
      Duration: true,
      license: {
        include: {
         licenseTopics:{
          include:{
             topic: {
            include: {
              questions: {
                include: {
                  bookmarks: true,
                  comments: true
                }
              }
            }
          }
          }
         }
        }
      }
    },
  });


  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk ? 'Successfully Retrived A Plan' : 'Failed to Get  Plan',
    Data: isOk ? result : [],
  });
});
const UpdatePlan = catchAsync(async (req, res) => {
  const { planId, name, price, interval, Duration, description } = req.body;

  if (!planId) throw new AppError(404, "Plan ID is required");

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw new AppError(404, "Plan not found");

  let updatedLicenseId = plan.licenseId;

  // External operations — Stripe
  let product = null;
  if (name) {
    product = await stripe.products.update(plan?.productId as string, { name });
  }

  let newStripePrice = null;
  const hasAny = price !== undefined || interval !== undefined || Duration !== undefined || description !== undefined || name !== undefined;
  const hasAll = price !== undefined && interval !== undefined && Duration !== undefined;

  if (hasAny && !hasAll) {
    throw new AppError(400, "To update price, interval, or duration, you must provide all three.");
  }

  if (hasAll) {
    newStripePrice = await stripe.prices.create({
      unit_amount: price * 100,
      currency: "usd",
      product: plan?.productId as string,
      recurring: { interval, interval_count: Duration },
    });
  }

  // Prisma Transaction
  const updatedPlan = await prisma.$transaction(async (tx) => {
    if (name) {
      const license = await tx.license.findFirst({ where: { name } });
      await NotFound(
        license,
        "The license name you provided does not exist in the license collection."
      );

      await tx.license.update({
        where: { id: license?.id },
        data: { name, price },
      });

      updatedLicenseId = license?.id as string;
    }

    return await tx.plan.update({
      where: { id: planId },
      data: {
        productName: name ?? plan.productName,
        productDescription: description ?? plan.productDescription,
        productPrice: price ?? plan.productPrice,
        interval: interval ?? plan.interval,
        Duration: Duration ?? plan.Duration,
        stripePriceId: newStripePrice?.id ?? plan.stripePriceId,
        productId: product?.id ?? plan.productId,
        licenseId: updatedLicenseId,
      },
    });
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successfully updated the plan",
    Data: updatedPlan,
  });
});



const deletePlan = catchAsync(async (req, res) => {
  const planId = req.params.id;

  // Check plan existence
  const isExist = await prisma.plan.findUnique({
    where: { id: planId },
  });

  if (!isExist) {
    throw new AppError(404, 'Plan does not exist');
  }



  const prices = await stripe.prices.list({
    product: isExist?.productId as string,
    active: true,   // optional: filter to only active prices
    limit: 100,     // max limit per request
  });

  // Number of active prices:
  const activePriceCount = prices.data.length;
  if (activePriceCount === 1) {
    throw new AppError(403, 'This Product have only Price Left So You Can not Delete it');
  }

  // Run DB transaction to delete plan and related subscriptions/payments
  await prisma.$transaction(async (tx) => {
    // Delete payments related to subscriptions of this plan
    await tx.payment.deleteMany({
      where: {
        subscription: {
          planId: planId,
        },
      },
    });

    // Delete subscriptions related to this plan
    await tx.subscription.deleteMany({
      where: { planId: planId },
    });

    // Finally, delete the plan itself
    await tx.plan.delete({
      where: { id: planId },
    });
  });

  // Deactivate Stripe price after DB transaction
  if (isExist.stripePriceId) {
    await stripe.prices.update(isExist.stripePriceId, {
      active: false,
    });
  }

  // Optionally, deactivate Stripe product if needed
  if (isExist.productId) {

    await stripe.products.update(isExist.productId, {
      active: false,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Successfully deleted plan and related data',
  });
});




const createSubscriptionSession = catchAsync(async (req, res) => {
  const { user } = req;
  const { priceId } = req.body;

  if (!priceId) {
    throw new AppError(
      400,
      'Plan priceId is required to create a subscription session',
    );
  }

  const plan = await prisma.plan.findUnique({
    where: {
      stripePriceId: priceId as string
    }
  })



  const isAlreadyHaveSubscription = await prisma.subscription.findUnique({
    where: {
      userId: user.id as string
    }
  })

  if (isAlreadyHaveSubscription && isAlreadyHaveSubscription?.isActive) {
    throw new AppError(404, 'You have Already a Active Subscription');
  }

  if (!plan) {
    throw new AppError(404, 'Plan');
  }

  if (!user || !user.id || !user.email) {
    throw new AppError(400, 'User information is missing or incomplete');
  }

  const RESPONSE = await SubscriptionService.createSubscriptionSession(
    user,
    plan
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription session created successfully',
    Data: RESPONSE,
  });
});

export const webhook = async (req: Request, res: Response) => {

  const sig = req.headers['stripe-signature'];
  let event;

  console.log('sig', sig);
  try {
    event = stripe.webhooks.constructEvent(
      req?.body,
      sig as string,
      config.stripe.subscription_webhook_sec as string,
    );
  } catch (err: any) {
    console.error('   Error deserializing webhook:', err.message);
    throw new AppError(
      HttpStatusCode.InternalServerError,
      'internal server error',
    );
  }
  console.log('✅ event type: ' + event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // await SubscriptionService.handleCheckoutSessionCompleted(

        //   event.data.object as Stripe.Checkout.Session,
        // );
        break;

      case 'customer.subscription.updated':
        await SubscriptionService.handleSubscriptionUpdated(event);
        break;

      case 'invoice.payment_succeeded':
        await SubscriptionService.handleInvoicePaymentSucceeded(
          event.data.object,
        );
        break;

      case 'customer.subscription.deleted':
        await SubscriptionService.deleteSubscription(event);
        break;

      case 'invoice.payment_failed':
        await SubscriptionService.handleInvoicePaymentFailed(event);
        break;

      case 'customer.subscription.trial_will_end':
        await SubscriptionService.handleSubscriptionWillEnd(event);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Subscription session created successfully',
    });
  } catch (error) {
    console.error('Error processing webhook event:', error);
  }
};


const subscribers = catchAsync(async (req, res) => {
  const result = await SubscriptionService.allsubscribers();
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk ? "Successfully retrived all Staff's " : "Failed to Retrive Staff",
    Data: isOk ? result : []
  })
})


//send email to subscripers

const sendEmailToSubscribers = catchAsync(async (req, res) => {
  const { text, subject, email } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  await NotFound(user);





  const finalHtmlContent = generateEmailTemplate(text);

  const result = await sendEmail(
    [{ email: user?.email as string }],
    subject,
    finalHtmlContent,
    text,

  )

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Successfully Sent Email to ${user?.name}`,
  })
})

export const SubscriptionController = {
  CreatePlan,
  UpdatePlan,
  deletePlan,
  AllPlans,
  SinglePlan,
  webhook,
  createSubscriptionSession
};
