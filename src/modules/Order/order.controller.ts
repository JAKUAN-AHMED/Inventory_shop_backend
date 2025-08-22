import { all } from 'axios';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderServices } from './order.service';
import { NotFound } from '../../utils/utility';
import { prisma } from '../../prisma/client';

const createOrder = catchAsync(async (req, res) => {
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
  const result = await OrderServices.createOrder(
    req.body,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Created Order' : 'Failed to Create Order',
    Data: isOk ? result : [],
  });
});
const updateOrder = catchAsync(async (req, res) => {

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
  const result = await OrderServices.updateOrder(
    req.params.id  as string,
    req.body,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk ? 'Successfully Updated a Order' : 'Failed to update a Order',
    Data: isOk ? result : [],
  });
});
const deleteOrder = catchAsync(async (req, res) => {
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
      id:shopId as string,
    },
  });

  await NotFound(shop, 'Shop');
  const result = await OrderServices.deleteOrder(
    shopId as string,
    req.params.id  as string,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk ? 'Successfully deleted a Order' : 'Failed to delete a Order',
    Data: isOk ? result : [],
  });
});
const allOrder = catchAsync(async (req, res) => {
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
 
  const result = await OrderServices.allOrder(
    shopId as string,
    req.query
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk ? 'Successfully retrived  Orders' : 'Failed to retrieved  Order',
    Data: isOk ? result : [],
  });
});
const singleOrder = catchAsync(async (req, res) => {
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
  const result = await OrderServices.singleOrder(
   shopId as string,
    req.params.id as string
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk ? 'Successfully retrived  a Order' : 'Failed to retrieve a Order',
    Data: isOk ? result : [],
  });
});


export const OrderController={
    createOrder,
    deleteOrder,
    updateOrder,
    allOrder,
    singleOrder
}