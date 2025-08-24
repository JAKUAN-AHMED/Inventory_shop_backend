import { Order } from '@prisma/client';
import { isShopExistByShopId, NotFound } from '../../utils/utility';
import { prisma } from '../../prisma/client';
import QueryBuilder from '../../builder/QueryBuilder';
type Items = {
  productId: string;
  quantity: number;
};
const createOrder = async (payload: Order & { items: Items[] }) => {
  const {
    customerId,
    shopId,
    name,
    description,
    method,
    status,
    Vat,
    discount,
    LabourCost,
    transportFare,
    payment,
    items,
  } = payload;

  const isExistShop = await isShopExistByShopId(shopId);
  await NotFound(isExistShop, 'Shop');

  const isCustomerExist = await prisma.customer.findUnique({
    where: { id: customerId, shopId: isExistShop?.id as string },
    include: { shop: true, orders: true, payment: true },
  });
  await NotFound(isCustomerExist, 'Customer');

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, shopId },
  });

  if (products.length !== items.length)
    throw new Error('One or more products do not exist in the shop.');

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found.`);
    if (item.quantity > product.quantity) {
      throw new Error(
        `Insufficient quantity for ${product.id}. Available: ${product.quantity}, Requested: ${item.quantity}`,
      );
    }
  }

  if (!items.length)
    throw new Error('Order must contain at least one product.');

  let totalAmount = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  const originalprice = totalAmount;
  const prevdue = isCustomerExist?.prevDue ?? 0;

  const invoicebill =
    Vat +
    originalprice +
    LabourCost +
    transportFare +
    prevdue -
    discount;

  const totaldue = invoicebill - payment;

  if (totaldue < 0)
    throw new Error('Total due cannot be negative after payment.');
  if (payment < 0) throw new Error('Payment cannot be negative.');
  if (payment > invoicebill)
    throw new Error('Payment cannot be greater than invoice bill.');

  // Run everything in a transaction
  return await prisma.$transaction(async (tx) => {
    // 1. Update customer
    await tx.customer.update({
      where: { id: customerId },
      data: {
        totalpayment: (isCustomerExist?.totalpayment as number) + payment,
        prevDue: totaldue,
      },
    });

    // 2. Create paymentInfo
    const payments = await tx.paymentInfo.create({
      data: {
        customerId,
        shopId,
        totalAmount: invoicebill,
        products: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              productId: product.id,
              quantity: item.quantity,
              price: product.price,
            };
          }),
        },
        totalDue: totaldue,
        totalpaid: payment,
        prevDue: prevdue,
      },
    });

    // 3. Create order
    const order = await tx.order.create({
      data: {
        customerId,
        name,
        description,
        shopId: isExistShop?.id as string,
        method,
        totalOriginalPrice: originalprice,
        status,
        Vat,
        discount,
        LabourCost,
        invoiceBill: invoicebill,
        prevDue: prevdue,
        transportFare,
        totalDue: totaldue,
        payment,
      },
    });

    return { order, payments };
  });
};

const updateOrder = async (id: string, payload: Partial<Order>) => {
  const isExistShop = await isShopExistByShopId(payload?.shopId as string);
  await NotFound(isExistShop, 'Shop');

  return await prisma.order.update({
    where: {
      id,
      shopId: isExistShop?.id as string,
    },
    data: {
      ...payload,
    },
  });
};
const deleteOrder = async (shopId: string, id: string) => {
  const isExistShop = await isShopExistByShopId(shopId);
  await NotFound(isExistShop, 'Shop');

  return await prisma.order.delete({
    where: {
      id,
      shopId: isExistShop?.id as string,
    },
  });
};
const allOrder = async (shopId: string, query: any) => {
  const isExistShop = await isShopExistByShopId(shopId);
  await NotFound(isExistShop, 'Shop');

  const builder = new QueryBuilder(query, prisma.order);
  const result = await builder
    .rawFilter({
      shopId: isExistShop?.id as string,
      status: { not: 'CANCELLED' },
    })
    .sort(['-createdAt'])
    .include({
      customer: true,
    })
    .execute();

  const meta = await builder.countTotal();

  return {
    meta,
    result,
  };
};
const singleOrder = async (shopId: string, id: string) => {
  const isExistShop = await isShopExistByShopId(shopId);
  await NotFound(isExistShop, 'Shop');

  return await prisma.order.findUnique({
    where: {
      id,
      shopId: isExistShop?.id as string,
    },
    include: {
      customer: true,
    },
  });
};

export const OrderServices = {
  createOrder,
  updateOrder,
  deleteOrder,
  allOrder,
  singleOrder,
};
