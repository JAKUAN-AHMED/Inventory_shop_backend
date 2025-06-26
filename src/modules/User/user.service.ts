import AppError from '../../errors/AppError';
import { prisma } from '../../prisma/client';
import { uploadToDigitalOceanAWS } from '../../utils/sendImageToCloudinary';
import { IUser } from './user.interface';



// get user by user id
const getingSigleuser = async (userId: string) => {
    return await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
};


const deleteduser = async (userId: string) => {
    return await prisma.user.delete({
        where: {
            id: userId,
        },
    });
}
const getAllUser = async () => {
    return await prisma.user.findMany();
}

const updateProfile = async (file:any,id: string, payload: Partial<IUser>) => {

    let imageUrls: string = '';
      if ( file ) {
        const { location: secure_url } = await uploadToDigitalOceanAWS(file);
        imageUrls=secure_url as string;
      }
      if(imageUrls){
        payload.profileImage=imageUrls;
      }

      if(payload.password )
      {
        throw new AppError(403,'You can change your password here');
      }
      if(payload.email )
      {
        throw new AppError(403,'You can change your email here');
      }
    const result = await prisma.user.update({
        where: {
            id
        },
        data: {
            ...payload
        }
    })

    return result;
}

export const UserServices = {

    getingSigleuser,
    deleteduser,
    updateProfile,
    getAllUser
};

