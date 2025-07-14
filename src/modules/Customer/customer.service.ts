import { Customer } from '@prisma/client';
import { prisma } from '../../prisma/client';
import {
  isExistUserById,
  isShopExist,
  isShopExistByShopId,
  NotFound,
} from '../../utils/utility';
import QueryBuilder from '../../builder/QueryBuilder';
const createCustomer = async (payload: Customer & { userId: string }) => {
  const {
    name,
    email,
    phone,
    fatherName,
    motherName,
    address,
    shopName,
    upazilla,
    road,
    zipCode,
    shopId,
    userId,
    DueLimit,
  } = payload;

  //check shop exist or not

  const isExistShop = await isShopExistByShopId(shopId);
  await NotFound(isExistShop, 'Shop');
  await isExistUserById(userId);

  const result = await prisma.customer.create({
    data: {
      name,
      email,
      phone,
      fatherName,
      motherName,
      address,
      DueLimit,
      shopId,
      shopName,
      zipCode,
      upazilla,
      road,
    },
  });

  return result;
};

//all customer
const allCustomers = async (query: any, userId: string) => {
  const shop = await isShopExist(userId);
  await NotFound(shop, 'Shop');
  const builder = new QueryBuilder(query, prisma.customer);
  const result = await builder
    .rawFilter({
      shopId: shop?.id as string,
    })
    .paginate()
    .execute();
  const meta = await builder.countTotal();

  return {
    meta,
    result,
  };
};

//single customer
const singlecustomer = async (id: string) => {
  return await prisma.customer.findUnique({
    where: {
      id,
    },
  });
};

//delete a customer
const deletecustomer = async (id: string) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id,
    },
  });
 await NotFound(customer,'Customer');
  return await prisma.customer.delete({
    where: {
      id,
    },
  });
};

//update customer
const updatecustomer = async (id: string, payload: Partial<Customer>) => {
  const isExistcustomer = await prisma.customer.findUnique({
    where: {
      id,
    },
  });
  await NotFound(isExistcustomer, 'customer');
  return await prisma.customer.update({
    where: {
      id: isExistcustomer?.id as string,
    },
    data: {
      ...payload,
    },
  });
};

export const customerService = {
  createCustomer,
  allCustomers,
  singlecustomer,
  deletecustomer,
  updatecustomer,
};
