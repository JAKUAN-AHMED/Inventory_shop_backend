import { prisma } from '../../prisma/client';



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



export const UserServices = {
    
    getingSigleuser,
    deleteduser
};

