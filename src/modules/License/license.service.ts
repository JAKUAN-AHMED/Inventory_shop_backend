import AppError from "../../errors/AppError";
import { prisma } from "../../prisma/client"
import { ILicense } from "./license.interface"


//create
const createLicense = async (payload: ILicense) => {
    const { name, type, description, price } = payload;
    const result = await prisma.license.create({
        data: {
            name,
            type,
            description,
            price
        }
    });
    return result;
}

//get all
const getAllLicense = async () => {
    const result = await prisma.license.findMany({
        include: {
            topics:true
        }
    });
    return result; 
}

//get single
const getSingleLicense = async (id: string) => {
    return await prisma.license.findUnique({
        where: {
            id
        },
        include:{
            topics:true
        }
    })
}


//delete single

const deleteLicense = async (id: string) => {
    /**
     * first  delete licence id from topics
     * delete licence from license collection
     */

    

   
    return await prisma.license.delete({
        where: {
            id
        }
    })


}

export const LicenseService = {
    createLicense,
    getAllLicense,
    getSingleLicense,
    deleteLicense
}