import { prisma } from '../../prisma/client';
import catchAsync from '../../utils/catchAsync';
import { uploadToDigitalOceanAWS } from '../../utils/sendImageToCloudinary';
import sendResponse from '../../utils/sendResponse';
import { NotFound } from '../../utils/utility';
import { customerService } from './customer.service';

const createcustomer = catchAsync(async (req, res) => {
  const userId = req.user.id as string;
  const normaluser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      shop: {
        select: { id: true },
      },
    },
  });

  let userShopId =
    normaluser?.shop && normaluser.shop.length > 0
      ? (normaluser.shop[0].id as string)
      : null;

  const staf = await prisma.staf.findUnique({
    where: {
      id: userId,
    },
  });
  const user = normaluser ? normaluser : staf;
  await NotFound(user, 'User');
  req.body.shopId = staf?.shopId || userShopId;

  const shop = await prisma.shop.findUnique({
    where: {
      id: req.body.shopId as string,
    },
  });

  await NotFound(shop, 'Shop');
  req.body.userId = userId;
  const result = await customerService.createCustomer(req.body);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Created customer '
      : 'Failed to Create customer',
    Data: isOk ? result : [],
  });
});

const allcustomers = catchAsync(async (req, res) => {
  const userId = req.user.id as string;
  const normaluser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      shop: {
        select: { id: true },
      },
    },
  });

  let userShopId =
    normaluser?.shop && normaluser.shop.length > 0
      ? (normaluser.shop[0].id as string)
      : null;

  const staf = await prisma.staf.findUnique({
    where: {
      id: userId,
    },
  });
  const user = normaluser ? normaluser : staf;
  await NotFound(user, 'User');
  const shopId = staf?.shopId || userShopId;

  const shop = await prisma.shop.findUnique({
    where: {
      id: shopId as string,
    },
  });

  await NotFound(shop, 'Shop');
  const result = await customerService.allCustomers(
    req.query,
    shopId as string,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Retriaved all customer'
      : 'Failed to Retrived all customer',
    Data: isOk ? result : [],
  });
});
const singlecustomer = catchAsync(async (req, res) => {
  const userId = req.user.id as string;
  const normaluser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      shop: {
        select: { id: true },
      },
    },
  });

  let userShopId =
    normaluser?.shop && normaluser.shop.length > 0
      ? (normaluser.shop[0].id as string)
      : null;

  const staf = await prisma.staf.findUnique({
    where: {
      id: userId,
    },
  });
  const user = normaluser ? normaluser : staf;
  await NotFound(user, 'User');
  const shopId = staf?.shopId || userShopId;

  const shop = await prisma.shop.findUnique({
    where: {
      id: shopId as string,
    },
  });

  await NotFound(shop, 'Shop');
  const result = await customerService.singlecustomer(
    shopId as string,
    req.params.id as string,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Retriaved  customer'
      : 'Failed to Retrived a customer',
    Data: isOk ? result : [],
  });
});
const deletecustomer = catchAsync(async (req, res) => {
  const userId = req.user.id as string;
  const normaluser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      shop: {
        select: { id: true },
      },
    },
  });

  let userShopId =
    normaluser?.shop && normaluser.shop.length > 0
      ? (normaluser.shop[0].id as string)
      : null;

  const staf = await prisma.staf.findUnique({
    where: {
      id: userId,
    },
  });
  const user = normaluser ? normaluser : staf;
  await NotFound(user, 'User');
  const shopId = staf?.shopId || userShopId;

  const shop = await prisma.shop.findUnique({
    where: {
      id: shopId as string,
    },
  });

  await NotFound(shop, 'Shop');
  const result = await customerService.deletecustomer(
    shopId as string,
    req.params.id as string,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Deleted  customer'
      : 'Failed to Deltete a customer',
    Data: isOk ? result : [],
  });
});

const updatecustomer = catchAsync(async (req, res) => {
const userId = req.user.id as string;
  const normaluser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      shop: {
        select: { id: true },
      },
    },
  });

  let userShopId =
    normaluser?.shop && normaluser.shop.length > 0
      ? (normaluser.shop[0].id as string)
      : null;

  const staf = await prisma.staf.findUnique({
    where: {
      id: userId,
    },
  });
  const user = normaluser ? normaluser : staf;
  await NotFound(user, 'User');
  req.body.shopId = staf?.shopId || userShopId;

  const shop = await prisma.shop.findUnique({
    where: {
      id: req.body.shopId as string,
    },
  });

  await NotFound(shop, 'Shop');

  const result = await customerService.updatecustomer(
    req.params.id as string,
    req.body,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Updated customer'
      : 'Failed to update a customer',
    Data: isOk ? result : [],
  });
});

export const customerController = {
  createcustomer,
  allcustomers,
  singlecustomer,
  deletecustomer,
  updatecustomer,
};
