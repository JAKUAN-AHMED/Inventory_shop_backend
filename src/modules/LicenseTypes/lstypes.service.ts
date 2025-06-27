import { LicenseType } from "@prisma/client";
import { prisma } from "../../prisma/client";

const AddLsType=async(payload:LicenseType)=>{
    return await prisma.licenseType.create({
        data:{
            title:payload.title
        }
    })
}


const getAllLicenseTypes=async()=>{
    const result=await prisma.licenseType.findMany({
        select:{
            id:true,
            title:true
        }
    })
    return result;
}


const DeleteLsType=async(id:string)=>{
    return await prisma.license.delete({
        where:{
            id
        }
    })
}

const SingleLsType=async(id:string)=>{
    return await prisma.licenseType.findUnique({
        where:{
            id
        }
    })
}

const updateLsType=async(id:string,title:string)=>{
    return await prisma.licenseType.update({
        where:{
            id
        },
        data:{
            title
        }
    })
}

export const LSServices={
    AddLsType,
    updateLsType,
    getAllLicenseTypes,
    SingleLsType,
    DeleteLsType
}