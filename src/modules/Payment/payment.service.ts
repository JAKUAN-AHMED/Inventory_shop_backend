import { PrismaQueryBuilder } from '../../builder/QueryBuilder';
import { prisma } from '../../prisma/client';

const getAllPayments = async (query: Record<string, unknown>) => {
  const queryParams = query as {
    page?: string;
    limit?: string;
    sort?: string;
    status?: string;
  };
  const searchableFields = ['name'];

  const queryBuilder = new PrismaQueryBuilder(queryParams, searchableFields);

  queryBuilder.buildWhere();
  queryBuilder.buildSort();
  queryBuilder.buildPagination();

  const prismaQuery = queryBuilder.getQuery();

  const payments = await prisma.payment.findMany(prismaQuery);

  const paginationMeta = await queryBuilder.getPaginationMeta(prisma.payment);

  return {
    payments,
    pagination: paginationMeta,
  };
};

const getUserPayments = async (userId: string) => {
  const paymentHistory = await prisma.payment.findMany({
    where: {
      subscription: {
        userId,
      },
    },
    include: {
      subscription: {
        include: {
          plan: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return paymentHistory;
};

export const PaymentServiece = { getAllPayments, getUserPayments };
