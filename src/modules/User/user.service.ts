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
  packagesApi
};

