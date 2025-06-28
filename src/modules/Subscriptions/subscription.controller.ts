
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
    licenseId
  } = req.body;

  if (!interval || !Duration || !description || !licenseId || !amount) {
    throw new AppError(404, 'a filed is missing');
  }
  const isExist = await prisma.license.findUnique({
    where: {
      id: licenseId,
    },
  });


  await NotFound(
    isExist,
    'The name you this is not exist at the license collection  and license',
  );

  const IsAlreadyHavePlan = await prisma.plan.findUnique({
    where: {
      productName: isExist?.name,
      interval,
      Duration,
      licenseId
    },
  });

  if (IsAlreadyHavePlan) {
    throw new Error('Already Created Plan');
  }

  const product = await stripe.products.create({ name: isExist?.name as string });
  const price = await stripe.prices.create({
    unit_amount: amount * 100,
    currency: currency,
    recurring: {
      interval: interval, // e.g., 'month'
      interval_count: Duration || 1, // e.g., 3 for every 3 months
    },
    product: product.id,
  });
  let dbplan;
  if (product) {
    dbplan = await prisma.plan.create({
      data: {
        productName: isExist?.name as string,
        productPrice: amount,
        productId: product.id,
        interval,
        Duration,
        licenseId,
        stripePriceId: price.id as string,
        productDescription: description,
      },
    });
  }

  const result = dbplan;
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 400,
    success: isOk,
    message: isOk
      ? 'Successfully Created  Plan'
      : 'Failed to Create Plan',
    Data: isOk ? result : []

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
          topics: {
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
          topics: {
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

  if (!planId) {
    throw new AppError(404, "Plan ID is required");
  }

  // 1. Find existing plan
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    throw new AppError(404, "Plan not found");
  }

  let updatedLicenseId = plan.licenseId;

  // 2. If name is provided, find matching license
  if (name) {
    const license = await prisma.license.findFirst({
      where: { name },
    });

    await NotFound(
      license,
      "The license name you provided does not exist in the license collection.",
    );

    await prisma.license.update({
      where: { id: license?.id },
      data: { name, price },
    });

    updatedLicenseId = license?.id as string;
  }

  const hasAny = price !== undefined || interval !== undefined || Duration !== undefined || description !== undefined || name !== undefined;
  const hasAll = price !== undefined && interval !== undefined && Duration !== undefined;

  if (hasAny && !hasAll) {
    throw new AppError(400, "To update price, interval, or duration, you must provide all three.");
  }

  // 3. Update Stripe product name if name is given
  let product = null;
  if (name) {
    product = await stripe.products.update(plan?.productId as string, { name });
  }

  // 4. If all fields are present, create a new Stripe price
  let newStripePrice = null;
  if (hasAll) {
    newStripePrice = await stripe.prices.create({
      unit_amount: price * 100,
      currency: "usd",
      product: plan?.productId as string,
      recurring: {
        interval,
        interval_count: Duration,
      },
    });
  }

  // 5. Update Plan in DB
  const updatedPlan = await prisma.plan.update({
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

  // 6. Response
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successfully updated the plan",
    Data: updatedPlan,
  });
});


const deletePlan = catchAsync(async (req, res) => {
  const isExistProduct = await prisma.plan.findFirst({
    where: {
      productId: req.params.id,
    },
  });

  await NotFound(isExistProduct, 'Plan');

  // const subscription=await prisma.subscription.findFirst({
  //   where:{
  //     planId:req.params.id
  //   }
  // })

  // if(subscription)
  // {
  //   await prisma.subscription.deleteMany({
  //     where:{
  //       planId:req.params.id
  //     }
  //   })
  // }


  //safely delete 
  await prisma.plan.deleteMany({
    where: {
      productId: req.params.id,
    },
  });
  const result = await stripe.products.update(req.params.id, {
    active: false,
  });

  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk ? 'Successfully Deleted Plan' : 'Failed to Delete Plan',
  });
});


const createSubscriptionSession = catchAsync(async (req, res) => {
  const { user } = req;
  const { name: planName } = req.body;

  if (!planName) {
    throw new AppError(
      400,
      'Plan name is required to create a subscription session',
    );
  }

  if (!user || !user.id || !user.email) {
    throw new AppError(400, 'User information is missing or incomplete');
  }

  const RESPONSE = await SubscriptionService.createSubscriptionSession(
    user,
    planName,
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
