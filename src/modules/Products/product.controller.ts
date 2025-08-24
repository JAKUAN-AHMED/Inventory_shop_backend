import AppError from '../../errors/AppError';
import { prisma } from '../../prisma/client';
import catchAsync from '../../utils/catchAsync';
import {
  deleteFromDigitalOceanAWS,
  uploadToDigitalOceanAWS,
} from '../../utils/sendImageToCloudinary';
import sendResponse from '../../utils/sendResponse';
import { NotFound } from '../../utils/utility';
import { productService } from './product.service';

const createProduct = catchAsync(async (req, res) => {
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
  if (!req.file) {
    throw new AppError(404, 'Image is required');
  }
  if (req.file) {
    const { location } = await uploadToDigitalOceanAWS(
      req.file as Express.Multer.File,
    );
    req.body.img = location as string;
  }
  req.body.price = parseFloat(req.body.price);
  req.body.quantity = parseInt(req.body.quantity);
  req.body.discountedPrice = parseFloat(req.body.discountedPrice);
  const result = await productService.createProduct(req.body);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Created Product '
      : 'Failed to Create Product',
    Data: isOk ? result : [],
  });
});

const allProducts = catchAsync(async (req, res) => {
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

  const result = await productService.allProducts(
    req.query,
    shop?.id as string,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Retriaved all Product'
      : 'Failed to Retrived all Product',
    Data: isOk ? result : [],
  });
});
const singleProduct = catchAsync(async (req, res) => {
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
  const result = await productService.singleProduct(
    shopId as string,
    req.params.id as string,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Retriaved  Product'
      : 'Failed to Retrived a Product',
    Data: isOk ? result : [],
  });
});
const deleteProduct = catchAsync(async (req, res) => {
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
  const isExistProduct = await prisma.product.findUnique({
    where: {
      id: req.params.id,
      shopId: shop?.id as string,
    },
  });
  await NotFound(isExistProduct, 'Product');
  if (isExistProduct?.img) {
    await deleteFromDigitalOceanAWS(isExistProduct?.img);
  }
  const result = await productService.deleteProduct(
    shopId as string,
    req.params.id as string,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Deleted  Product'
      : 'Failed to Deltete a Product',
    Data: isOk ? result : [],
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const file = req.file as Express.Multer.File;

  if (file) {
    const { location } = await uploadToDigitalOceanAWS(file);
    req.body.img = location as string;
  }

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
    const { location } = await uploadToDigitalOceanAWS(
      req.file as Express.Multer.File,
    );
    req.body.img = location as string;
  }
  if (req.body.price) {
    req.body.price = parseFloat(req.body.price);
  }
  const isExistProduct = await prisma.product.findUnique({
    where: {
      id: req.params.id,
      shopId: shop?.id as string,
    },
  });
  await NotFound(isExistProduct, 'Product');
  if (
    isExistProduct?.img &&
    req.body.img &&
    isExistProduct.img !== req.body.img
  ) {
    await deleteFromDigitalOceanAWS(isExistProduct?.img);
  }
  const result = await productService.updateProduct(
    req.params.id as string,
    req.body,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Updated Product'
      : 'Failed to update a Product',
    Data: isOk ? result : [],
  });
});

export const ProductController = {
  createProduct,
  allProducts,
  singleProduct,
  deleteProduct,
  updateProduct,
};
