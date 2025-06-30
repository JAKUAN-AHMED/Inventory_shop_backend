import AppError from '../../errors/AppError';
import { prisma } from '../../prisma/client';
import { upload, uploadToDigitalOceanAWS } from '../../utils/sendImageToCloudinary';
import { isExistUserById } from '../../utils/utility';
import { IUser } from './user.interface';
import { addMonths, format, subMonths } from 'date-fns';


// get user by user id
const getingSigleuser = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};


const deleteduser = async (userId: string) => {


  const isExist = await isExistUserById(userId);
  return await prisma.user.delete({
    where: {
      id: userId,
    },
  });
}
const getAllUser = async () => {
  return await prisma.user.findMany();
}

const updateProfile = async (file: any, id: string, payload: Partial<IUser>) => {

  let imageUrls: string = '';
  if (file) {
    // imageUrls = `${process.env.BACKEND_LIVE_URL}/uploads/${file.filename}`;
    const { location } = await uploadToDigitalOceanAWS(file);
    imageUrls = location;
  }
  if (imageUrls) {
    payload.profileImage = imageUrls;
  }

  if (payload.password) {
    throw new AppError(403, 'You can not change your password here');
  }
  if (payload.email) {
    throw new AppError(403, 'You can  not change your email here');
  }
  // Map payload to match Prisma's expected input types
  const prismaPayload: any = { ...payload };

  // If role is present, ensure it matches the Prisma enum type
  if (payload.role) {
    prismaPayload.role = payload.role as any; // Cast to 'any' or directly to 'UserRole' if imported
  }

  const result = await prisma.user.update({
    where: {
      id
    },
    data: prismaPayload
  })

  return result;
}



//analytis for every month
type MonthlyAnalytics = {
  month: string;
  testsCompleted: number;
  results: {
    testName: string;
    licenseName: string;
    percentage: number;
    date: string;
  }[];
};

const getUserTestAnalytics = async (userId: string): Promise<MonthlyAnalytics[]> => {
  const now = new Date();
  const fromDate = subMonths(now, 11); // 12 months ago

  // Step 1: Initialize 12 months
  const monthlyData: Record<string, MonthlyAnalytics> = {};
  for (let i = 0; i < 12; i++) {
    const monthDate = addMonths(fromDate, i);
    const monthKey = format(monthDate, "MMMM yyyy"); // e.g., "July 2024"
    monthlyData[monthKey] = {
      month: monthKey,
      testsCompleted: 0,
      results: [],
    };
  }

  // Step 2: Fetch test results for those 12 months
  const testResults = await prisma.testResult.findMany({
    where: {
      userId,
      status: "IN_PROGRESS",
      date: {
        gte: new Date(fromDate.getFullYear(), fromDate.getMonth(), 1),
        lte: new Date(now.getFullYear(), now.getMonth() + 1, 0), // end of this month
      },
    },
    include: {
      test: {
        select: {
          date: true,
          topic: { select: { name: true } },
          license: { select: { name: true } },
        },
      },
    },
  });

  // Step 3: Group results by month
  testResults.forEach((result) => {
    const month = format(new Date(result.date), "MMMM yyyy");

    if (monthlyData[month]) {
      monthlyData[month].testsCompleted += 1;
      monthlyData[month].results.push({
        testName: result.test?.topic?.name || "Untitled Test",
        licenseName: result.test?.license?.name || "N/A",
        percentage: result.percentage ?? 0,
        date: format(new Date(result.date), "yyyy-MM-dd"),
      });
    }
  });

  // Step 4: Return sorted array of months
  const sortedAnalytics = Object.values(monthlyData).sort((a, b) => {
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateA.getTime() - dateB.getTime();
  });

  return sortedAnalytics;

};


const packagesApi = async (userId: string) => {
  const result = await prisma.subscription.findUnique({
    where: {
      userId,
    },
    select: {
      isActive:true,
      startDate: true,
      endDate: true,
      plan: {
        select: {
          productName: true
        }
      }
    }
  })

  if(result?.isActive===false)
  {
    throw new AppError(404,'User Does Not Have Active Subscription');
  }

  const packageName = result?.plan.productName;
  const startDate = result?.startDate ? new Date(result.startDate) : null;
  const endDate = result?.endDate ? new Date(result.endDate) : null;

  let daysLeft = 0;

  if (endDate) {
    const today = new Date();

    // Get difference in milliseconds
    const diff = endDate.getTime() - today.getTime();

    // Convert milliseconds to full days
    daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  return {
    packageName,
    daysLeft
  }

}

export const UserServices = {
  getingSigleuser,
  deleteduser,
  updateProfile,
  getAllUser,
  getUserTestAnalytics,
  packagesApi
};

