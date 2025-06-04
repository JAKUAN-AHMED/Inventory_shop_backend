import { prisma } from '../../prisma/client';
import { IUser } from './user.interface';


const createUser = async (payload: IUser): Promise<IUser | null> => {

    console.log(payload);
  return await prisma.user.create({
    data: {
        ...payload
    },
  });
};

    // get all user
const getAllUser = async () => {
    return await prisma.user.findMany();
};



// get user by user id
const getingSigleuser = async (userId: string) => {
        return await prisma.user.findUnique({
        where: {
            id: userId,
        },
        });
};


// get all user by role
const updateUser = async (id: string , data: any) => {
      return await prisma.user.update({
        where:{
            id: id
        },
        data:{
            ...data
        }
      })
};


const deleteduser = async (userId: string) => {
    return await prisma.user.delete({
        where: {
            id: userId,
        },
    });
}



export const UserServices = {
    createUser,
    getAllUser,
    getingSigleuser,
    updateUser,
    deleteduser
};

