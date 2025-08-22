import { prisma } from '../../prisma/client';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotFound } from '../../utils/utility';
import { suppliersService } from './suppliers.service';

const createSupplier = catchAsync(async (req, res) => {
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
  req.body.file = req.file?.filename as string;
  req.body.prevdueMoney = parseFloat(req.body.prevdueMoney);
  const result = await suppliersService.createSupplier(req.body);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Created Supplier'
      : 'Failed to Create Supplier',
    Data: isOk ? result : [],
  });
});

//update supplier
const updateSupplier = catchAsync(async (req, res) => {
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
  if (req.file) {
    req.body.file = req.file.filename as string;
  }
  req.body.id = req.params.id;
  const result = await suppliersService.updateSupplier(req.body);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Updated Supplier'
      : 'Failed to Update Supplier',
    Data: isOk ? result : [],
  });
});

//delete supplier
const deleteSupplier = catchAsync(async (req, res) => {
  const { id } = req.params;
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

  console.log('user', user);
  await NotFound(user, 'User');
  const shopId = staf?.shopId || userShopId;

  const shop = await prisma.shop.findUnique({
    where: {
      id: shopId as string,
    },
  });

  await NotFound(shop, 'Shop');

  const result = await suppliersService.deleteSupplier(id, shopId as string);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Deleted Supplier'
      : 'Failed to Delete Supplier',
    Data: isOk ? result : [],
  });
});

//get all suppliers
const getAllSuppliers = catchAsync(async (req, res) => {
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

  console.log('user', user);
  await NotFound(user, 'User');
  const shopId = staf?.shopId || userShopId;

  const shop = await prisma.shop.findUnique({
    where: {
      id: shopId as string,
    },
  });

  await NotFound(shop, 'Shop');
  const query = req.query;

  const result = await suppliersService.getAllSuppliers(
    shopId as string,
    query,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Retrieved Suppliers'
      : 'Failed to Retrieve Suppliers',
    Data: isOk ? result : [],
  });
});

//get single supplier
const getSingleSupplier = catchAsync(async (req, res) => {
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

  console.log('user', user);
  await NotFound(user, 'User');
  const shopId = staf?.shopId || userShopId;

  const shop = await prisma.shop.findUnique({
    where: {
      id: shopId as string,
    },
  });

  await NotFound(shop, 'Shop');
  const { id } = req.params;

  const result = await suppliersService.getSupplierById(id, shopId as string);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Retrieved Supplier'
      : 'Failed to Retrieve Supplier',
    Data: isOk ? result : [],
  });
});

export const suppliersController = {
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getAllSuppliers,
  getSingleSupplier,
};
