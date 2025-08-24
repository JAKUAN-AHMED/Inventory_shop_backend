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
};

type CreatePaymentInput = {
  customerId: string;
  shopId: string;
  items: PaymentItemInput[];
  totalDue:number;
  totalpaid:number;
};
const createPayment = async (payload: CreatePaymentInput) => {
  const { customerId, shopId, items, totalpaid } = payload;
  if(!customerId || !shopId || !items || !totalpaid ) throw new Error('some fields are required.');
  if(!totalpaid && totalpaid !== 0) throw new Error('Total paid is required.');
  if(totalpaid < 0) throw new Error('Total paid cannot be negative.');
 

  const customerExist = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customerExist) throw new Error('Customer does not exist.');

  const productIds = items.map(i => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, shopId },
  });

  if (products.length !== items.length) throw new Error('One or more products do not exist in the shop.');

  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found.`);
    if (item.quantity > product.quantity) {
      throw new Error(`Insufficient quantity for ${product.id}. Available: ${product.quantity}, Requested: ${item.quantity}`);
    }
  }

  const isExistShop = await isShopExistByShopId(shopId);
  await NotFound(isExistShop);
  if (!items.length) throw new Error('Payment must contain at least one product.');

  let totalAmount = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  const prevdue = customerExist.prevDue ?? 0;
  totalAmount += prevdue;

  const totaldue = totalAmount - totalpaid;
  if (totaldue < 0) throw new Error('Total due cannot be negative after payment.');

  await prisma.customer.update({
    where: { id: customerId },
    data: {
      totalpayment: totalpaid,
      prevDue: totaldue,
    },
  });

  return await prisma.paymentInfo.create({
    data: {
      customerId,
      shopId,
      totalAmount,
      products: {
        create: items.map((item) => {
          const product = products.find(p => p.id === item.productId)!;
          return {
            productId: product.id,
            quantity: item.quantity,
            price: product.price,
          };
        }),
      },
      totalDue: totaldue,
      totalpaid,
      prevDue: prevdue,
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
