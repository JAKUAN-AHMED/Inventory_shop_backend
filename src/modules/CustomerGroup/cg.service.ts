import { customerGroup } from '@prisma/client';
import { alreadyExist, isShopExist, NotFound } from '../../utils/utility';
import { prisma } from '../../prisma/client';

//creat group
const creatCg = async (userId: string, payload: customerGroup) => {
  const { name, customerId, shopId, date } = payload;
  const isExistShop = await isShopExist(userId);
  await NotFound(isExistShop, 'Shop');

  const isAlreadyExist = await prisma.customerGroup.findFirst({
    where: {
      name,
    },
  });

  await alreadyExist(isAlreadyExist, 'This group already Exist');

  return await prisma.customerGroup.create({
    data: {
      name,
      customerId,
      shopId,
      date,
    },
  });
};

//update group
const updateCg = async (
  userId: string,
  id: string,
  payload: Partial<customerGroup>,
) => {
  const { name, customerId, shopId, date } = payload;
  const isExistShop = await isShopExist(userId);
  await NotFound(isExistShop, 'Shop');

  const isExist = await prisma.customerGroup.findUnique({
    where: {
      id,
    },
  });

  await NotFound(isExist, 'Customer group');

  return await prisma.customerGroup.update({
    where: { id },
    data: { ...payload },
  });
};

//get all gruops
const getAllMyCGroups = async (userId: string) => {
  const isExistShop = await isShopExist(userId);
  await NotFound(isExistShop, 'Shop');
  return await prisma.customerGroup.findMany(
    {
        where:{shopId:isExistShop?.id as string}
    }
  );
};

//single group
const singleCGroup = async (userId: string,id:string) => {
 const isExistShop = await isShopExist(userId);
  await NotFound(isExistShop, 'Shop');
  return await prisma.customerGroup.findUnique(
    {
        where:{
            id,
            shopId:isExistShop?.id as string
        }
    }
  );
};


//delete group

const deleteCGroup = async (userId: string,id:string) => {
 const isExistShop = await isShopExist(userId);
  await NotFound(isExistShop, 'Shop');
  return await prisma.customerGroup.delete(
    {
        where:{
            id,
            shopId:isExistShop?.id as string
        }
    }
  );
};

export const customerGroupServices={
    creatCg,
    updateCg,
    deleteCGroup,
    getAllMyCGroups,
    singleCGroup
}