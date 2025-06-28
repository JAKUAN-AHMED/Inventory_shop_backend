import { SaveTest } from "@prisma/client";
import { prisma } from "../../prisma/client";

const saveTest=async(payload:SaveTest)=>{
    const{userId,topicId,licenseId}=payload;
    return await prisma.saveTest.create({
        data:{
            userId,
            topicId,
            licenseId
        }
    })
}


const MySaveTest=async(userId: string)=>{
    return await prisma.saveTest.findMany({
        where:{
            userId
        }
        ,
        include:{
            topic:true,
            license:true
        }
    })
}

const mySingleSaveTest=async(userId:string,saveTestId:string)=>{
    return await prisma.saveTest.findUnique({
        where:{
            userId,
            id:saveTestId
        },
        include:{
            topic:true,
            license:true
        }
    })
}
const DeletemySingleSaveTest=async(userId:string,saveTestId:string)=>{
    return await prisma.saveTest.delete({
        where:{
            userId,
            id:saveTestId
        }
    })
}


export const SaveTestService={
    saveTest,
    mySingleSaveTest,
    MySaveTest,
    DeletemySingleSaveTest
}

