import { Order } from '@prisma/client';
import { isShopExist, NotFound } from '../../utils/utility';
import { prisma } from '../../prisma/client';
import QueryBuilder from '../../builder/QueryBuilder';

const createOrder = async (userId: string, payload: Order) => {
  const {
    customerId,
    shopId,
    method,
    totalOriginalPrice,
    status,
    Vat,
    discount,
    LabourCost,
    invoiceBill,
    prevDue,
    transportFare,
    totalDue,
    payment,
  } = payload;

  const isExistShop = await isShopExist(userId);
  await NotFound(isExistShop, 'Shop');

  return await prisma.order.create({
    data: {
      customerId,
      shopId,
      method,
      totalOriginalPrice,
      status,
      Vat,
      discount,
      LabourCost,
      invoiceBill,
      prevDue,
      transportFare,
      totalDue,
      payment,
    },
  });
};
const updateOrder = async (userId: string, id:string,payload: Partial<Order>) => {

  const isExistShop = await isShopExist(userId);
  await NotFound(isExistShop, 'Shop');

  return await prisma.order.update({
    where:{
      id,
      shopId:isExistShop?.id as string
    },
    data: {
     ...payload
    },
  });
};
const deleteOrder = async (userId: string, id:string) => {

  const isExistShop = await isShopExist(userId);
  await NotFound(isExistShop, 'Shop');

  return await prisma.order.delete({
    where:{
      id,
      shopId:isExistShop?.id as string
    },
   
  });
};
const allOrder = async (userId: string,query:any) => {

  const isExistShop = await isShopExist(userId);
  await NotFound(isExistShop, 'Shop');


  const builder=new QueryBuilder(query,prisma.order);
  const result=await builder
  .rawFilter({
    shopId:isExistShop?.id as string
  })
  .sort(['-createdAt'])
  .include({
    customer:true,
  })
  .execute();

  const meta=await builder.countTotal();

  return {
    meta,
    result
  }
 
};
const singleOrder = async (userId: string,id:string) => {

  const isExistShop = await isShopExist(userId);
  await NotFound(isExistShop, 'Shop');


  return await prisma.order.findUnique({
    where:{
      id,
      shopId:isExistShop?.id as string
    },
    include:{
      customer:true
    }
  })
 
};

export const OrderServices={
  createOrder,
  updateOrder,
  deleteOrder,
  allOrder,
  singleOrder
}