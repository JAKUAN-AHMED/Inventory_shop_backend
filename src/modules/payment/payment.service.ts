import { PaymentInfo } from '@prisma/client';
import {
  isShopExist,
  isShopExistByShopId,
  NotFound,
} from '../../utils/utility';
import { prisma } from '../../prisma/client';
import QueryBuilder from '../../builder/QueryBuilder';

type PaymentItemInput = {
  productId: string;
  quantity: number;
  price: number;
};

type CreatePaymentInput = {
  customerId: string;
  shopId: string;
  items: PaymentItemInput[];
};
const createPayment = async (payload: CreatePaymentInput) => {
  const { customerId, shopId, items } = payload;
  const isExistShop = await isShopExistByShopId(shopId);
  await NotFound(isExistShop);
  if (!items || items.length === 0) {
    throw new Error('Payment must contain at least one product.');
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return await prisma.paymentInfo.create({
    data: {
      customerId,
      shopId,
      totalAmount,
      products: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });
};
const allpayment = async (shopId: string, query: any) => {
  const isExistShop = await isShopExistByShopId(shopId);
  await NotFound(isExistShop);
  const builder = new QueryBuilder(query, prisma.paymentInfo);
  const result = await builder
    .rawFilter({
      shopId: isExistShop?.id as string,
    })
    .include({
      customer: true,
      shop: true,
    })
    .sort(['-createdAt'])
    .paginate()
    .execute();

  const meta = await builder.countTotal();

  return {
    meta,
    result,
  };
};

const singlePaymentById = async (shopId: string, id: string) => {
  const isExistShop = await isShopExistByShopId(shopId);
  await NotFound(isExistShop);

  return await prisma.paymentInfo.findUnique({
    where: {
      id,
      shopId: isExistShop?.id as string,
    },
  });
};
const customerPayment = async (shopId: string, customerId: string) => {
  const isExistShop = await isShopExistByShopId(shopId);
  await NotFound(isExistShop);

  return await prisma.paymentInfo.findFirst({
    where: {
      customerId,
      shopId: isExistShop?.id as string,
    },
  });
};

export const paymentServices = {
  createPayment,
  allpayment,
  singlePaymentById,
  customerPayment,
};
