import { Request, Response } from 'express';
import { prisma } from '../../prisma/client';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import config from '../../config';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/AppError';
import { NotFound } from '../../utils/utility';
import stripe from '../../config/stripe';

//create produc
const CreatePlan = catchAsync(async (req, res) => {
  const {
    name,
    amount,
    currency = 'usd',
    interval,
    Duration,
    description,
  } = req.body;

  const isExist = await prisma.license.findUnique({
    where: {
      name,
    },
  });

  await NotFound(
    isExist,
    'The name you this is not exist at the license collection  and license',
  );

  const IsAlreadyHavePlan = await prisma.plan.findUnique({
    where: {
      productName: name,
    },
  });

  if (IsAlreadyHavePlan) {
    throw new Error('Already Created Plan');
  }

  const product = await stripe.products.create({ name });
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
        productName: name,
        productPrice: amount,
        interval,
        Duration,
        productDescription: description,
      },
    });
  }
  const result = {
    product,
    price,
    plan:dbplan
  };
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 400,
    success: isOk,
    message: isOk
      ? 'Successfully Created  Plan'
      : 'Failed to Create Plan',
    Data:isOk ? result : []

  });
});

const AllPlans = catchAsync(async (req, res) => {
  const result = await prisma.plan.findMany({
    select: {
      productName: true,
      productId: true,
      interval:true,
      Duration:true
    },
  });

  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk ? 'Successfully Retrived All Plans' : 'Failed to Get  Plans',
    Data: isOk ? result : [],
  });
});
const UpdatePlan = catchAsync(async (req, res) => {
  const { name, price ,interval,Duration,description} = req.body;
  let isExist = null;
  if (name) {
    isExist = await prisma.license.findUnique({
      where: {
        name,
      },
    });

    await NotFound(
      isExist,
      'The name you this is not exist at the license collection  and license',
    );
    await prisma.license.update({
      where: {
        id: isExist?.id,
      },
      data: {
        price,
        name,
      },
    });
  }
  const product = await stripe.products.update(req.params.id, { name });
  if (price) {
    await NotFound(req.params.id, 'Product Id');
    // Create new price for the product
    const newPrice = await stripe.prices.create({
      unit_amount: price * 100,
      currency: 'usd',
      product: req.params.id,
    });
  }
  await prisma.plan.update({
      where: {
        productName: name,
      },
      data: {
        productPrice: price,
        productId:product.id,
        productDescription:description,
        interval,
        Duration
      },
    });
  const isOk = product ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk
      ? 'Successfully Update Plan Name'
      : 'Failed to Update Plan',
  });
});

const deletePlan = catchAsync(async (req, res) => {
  const isExistProduct = await prisma.plan.findUnique({
    where: {
      productId: req.params.id,
    },
  });

  await NotFound(isExistProduct, 'Plan');

  await prisma.plan.delete({
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
