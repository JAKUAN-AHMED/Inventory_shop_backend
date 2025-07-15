import { Pvariant } from "@prisma/client";
import { prisma } from "../../prisma/client";
import QueryBuilder from "../../builder/QueryBuilder";

const createVariant=async(payload:Pvariant)=>{
    const {type,description}=payload;

    return await prisma.pvariant.create({
        data:{
            type,
            description
        }
    })

}
const updateVariant=async(id:string,payload:Partial<Pvariant>)=>{
    const {type,description}=payload;

    return await prisma.pvariant.update({
        where:{
            id
        },
        data:{
           ...payload
        }
    })

}
const deleteVariant=async(id:string)=>{

    return await prisma.pvariant.delete({
        where:{
            id
        }
    })

}
const singleVariant=async(id:string)=>{

    return await prisma.pvariant.findUnique({
        where:{
            id
        }
    })

}


const allVariant=async(query:any)=>{
    const builder=new QueryBuilder(query,prisma.pvariant);
    const result=await builder
    .paginate()
    .execute();

    const meta=await builder.countTotal();

    return {
        meta,
        result
    }
}


export const VariantService={
    createVariant,
    updateVariant,
    deleteVariant,
    allVariant,
    singleVariant
}