import { LicenseType } from "@prisma/client";
import { prisma } from "../../prisma/client";
import AppError from "../../errors/AppError";
import { NotFound } from "../../utils/utility";

const AddLsType=async(payload:LicenseType)=>{

    const isExist=await prisma.licenseType.findUnique({
        where:{
            title:payload.title
        }
    })

    if(isExist)
    {
        throw new AppError(409,"Already Exist");
    }
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
     const result=await prisma.licenseType.findUnique({
        where:{
            id
        }
    })

    await NotFound(result,'LicenseType');
    return await prisma.licenseType.delete({
        where:{
            id
        }
    })
}

const SingleLsType=async(id:string)=>{
    
    const result=await prisma.licenseType.findUnique({
        where:{
            id
        }
    })

    await NotFound(result,'LicenseType');
    return await prisma.licenseType.findUnique({
        where:{
            id
        }
    })
}

const updateLsType=async(id:string,title:string)=>{
     const result=await prisma.licenseType.findUnique({
        where:{
            id
        }
    })

    await NotFound(result,'LicenseType');
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