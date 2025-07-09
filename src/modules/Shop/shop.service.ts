import { prisma } from '../../prisma/client';
import { IUser } from '../User/user.interface';

const shopIntoFromDB = async (
  file: any,
  id: string,
  payload: Partial<IUser>,
) => {
  let imageUrls: string = '';
  if (file) {
    // imageUrls = `${process.env.BACKEND_LIVE_URL}/uploads/${file.filename}`;
    // const { location } = await uploadToDigitalOceanAWS(file);
    // imageUrls = location;
  }
  if (imageUrls) {
    payload.profileImage = imageUrls;
  }

  const prismaPayload: any = { ...payload };

  // If role is present, ensure it matches the Prisma enum type
  if (payload.role) {
    prismaPayload.role = payload.role as any; // Cast to 'any' or directly to 'UserRole' if imported
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: prismaPayload,
  });

  return result;
};

export const ShopServices = {
  shopIntoFromDB,
};
