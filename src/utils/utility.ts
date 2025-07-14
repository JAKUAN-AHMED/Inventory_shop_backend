import AppError from '../errors/AppError';
import { prisma } from '../prisma/client';

export async function isExistByEmail(email: string) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return existingUser;
}

export async function alreadyExist(param: any, msg?: string) {
  if (param) {
    throw new AppError(409, `${msg}`);
  }
}

export async function isExistUserById(id: string) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function NotFound(value: any, msg?: string) {
  if (!value) {
    throw new AppError(404, `${msg} Not Found`);
  }
}

export async function isShopExist(userId:string) {
  return await prisma.shop.findUnique({
    where: { userId },
  });
}
export async function isShopExistByShopId(id:string) {
  return await prisma.shop.findUnique({
    where: { id },
  });
}

