import { prisma } from '../../prisma/client';
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


const updateProfile=async(id:string,payload:Partial<IUser>)=>{
    const result=await prisma.user.update({
where:{
    id
},
data:{
    ...payload
}
    })
}

export const UserServices = {
    
    getingSigleuser,
    deleteduser
};

