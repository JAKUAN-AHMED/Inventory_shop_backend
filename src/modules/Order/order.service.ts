import { Order } from '@prisma/client';
import { isShopExist, isShopExistByShopId, NotFound } from '../../utils/utility';
import { prisma } from '../../prisma/client';
import QueryBuilder from '../../builder/QueryBuilder';
import status from 'http-status';

const createOrder = async (payload: Order) => {
  const {
    customerId,
    shopId,
    name,
    description,
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

  const isExistShop = await isShopExistByShopId(shopId);
  await NotFound(isExistShop, 'Shop');


  //customter
  const isCustomerExist=await prisma.customer.findUnique({
    where:{
      id: customerId,
      shopId:isExistShop?.id as string
    },
    include:{
      shop:true,
      orders:true,
      payment:true,
    }
  })

  await NotFound(isCustomerExist, 'Customer');
  

  return await prisma.order.create({
    data: {
      customerId,
      name,
      description,
      shopId:isExistShop?.id as string,
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
const updateOrder = async (id:string,payload: Partial<Order>) => {

  const isExistShop = await isShopExistByShopId(payload?.shopId as string);
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
const deleteOrder = async (shopId: string, id:string) => {

  const isExistShop = await isShopExistByShopId(shopId);
  await NotFound(isExistShop, 'Shop');

  return await prisma.order.delete({
    where:{
      id,
      shopId:isExistShop?.id as string
    },
   
  });
};
const allOrder = async (shopId: string,query:any) => {

  const isExistShop = await isShopExistByShopId(shopId);
  await NotFound(isExistShop, 'Shop');


  const builder=new QueryBuilder(query,prisma.order);
  const result=await builder
  .rawFilter({
    shopId:isExistShop?.id as string,
    status:{not:"CANCELLED"}
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
const singleOrder = async (shopId: string,id:string) => {

  const isExistShop = await isShopExistByShopId(shopId);
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