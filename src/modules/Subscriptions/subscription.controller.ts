
import { prisma } from '../../prisma/client';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotFound } from '../../utils/utility';
import stripe from '../../config/stripe';
import AppError from '../../errors/AppError';

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

  const isExist = await prisma.license.findUnique({
    where: {
      id:licenseId,
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

  const product = await stripe.products.create({  name: isExist?.name as string });
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
        productName: isExist?.name,
        productPrice: amount,
        productId: product.id,
        interval,
        Duration,
        licenseId,
        productDescription: description,
      },
    });
  }
 
  const result=dbplan;
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
      productName: true,
      productId: true,
      interval: true,
      Duration: true
    },
  });

  const license=await prisma.license.findMany({
    where:{
      name:result?.[0]?.productName as string
    },
    include:{
      topics:{
        include:{
          questions:true
        }
      }
    }
  })

  const result1={
    plan:result,
    license
  }
  const isOk = result1.plan.length && result1?.license? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk ? 'Successfully Retrived All Plans' : 'Failed to Get  Plans',
    Data: isOk ? result1 : [],
  });
});
const UpdatePlan = catchAsync(async (req, res) => {
  const { name, price, interval, Duration, description } = req.body;


  let isExist = null;

  // Check if license exists
  if (name) {
    isExist = await prisma.license.findUnique({
      where: { name },
    });

    await NotFound(
      isExist,
      'The license name you provided does not exist in the license collection.',
    );

    await prisma.license.update({
      where: { id: isExist?.id },
      data: { name, price },
    });
  }

 const hasAny = price !== undefined || interval !== undefined || Duration !== undefined;
const hasAll = price !== undefined && interval !== undefined && Duration !== undefined;

if (hasAny && !hasAll) {
  throw new AppError(400, 'To update price, interval, or duration, you must provide all three: price, interval, and duration.');
}


  // Update the product name if provided
  const product = await stripe.products.update(req.params.id, {
    name,
  });

  let newStripePrice = null;

  if (price && interval && Duration) {
    // ⚠️ Stripe does NOT allow updating an existing price — create a new one
    newStripePrice = await stripe.prices.create({
      unit_amount: price * 100, // price in cents
      currency: 'usd',
      product: req.params.id,
      recurring: {
        interval,          // 'day', 'week', 'month', or 'year'
        interval_count: Duration, // how many of those intervals
      },
    });

     // Update your local DB plan
  await prisma.plan.create({
    data: {
      productPrice: price,
      productId: product.id,
      productDescription: description,
      interval,
      Duration,
      licenseId:isExist?.id as string
    },
  });
  }
  else{
    // Update your local DB plan
  await prisma.plan.update({
    where: { id: req.params.id }, // Assuming 'id' is the unique identifier for the plan
    data: {
      productPrice: price,
      productId: product.id,
      productDescription: description,
      interval,
      Duration,
    },
  });
  }

  const isOk = product ? true : false;

  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk
      ? 'Successfully Updated Plan'
      : 'Failed to Update Plan',
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


export const SubscriptionController = {
  CreatePlan,
  UpdatePlan,
  deletePlan,
  AllPlans,
};
