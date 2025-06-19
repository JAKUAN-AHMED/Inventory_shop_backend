import { prisma } from "../../prisma/client"
import { ILicense } from "./license.interface"

const createLicense = async (payload: ILicense) => {
    const {name,type,description,price}=payload;
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


const getAllLicense=async()=>{
     return await prisma.license.findMany();
}


const getSingleLicense=async(id:string)=>{
    return await prisma.license.findUnique({
    where:{
        id
    }
    })
}


const deleteLicense=async(id:string)=>{
    /**
     * first  delete licence id from topics
     * delete licence from license collection
     */

    // const topics=-await prisma.topic.delete({
    //     where:{
    //         licenseId:["id"]
    //     }
    // })


    return await prisma.license.delete({
        where:{
            id
        }
    })


}

export const LicenseService={
    createLicense,
    getAllLicense,
    getSingleLicense,
    deleteLicense
}