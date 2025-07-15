

import { prisma } from "../../prisma/client";
import QueryBuilder from "../../builder/QueryBuilder";
import { PCateory } from "@prisma/client";

const createCategory=async(payload:PCateory)=>{
    const {name,description}=payload;

    return await prisma.pCateory.create({
        data:{
            name,
            description
        }
    })

}
const updateCategory=async(id:string,payload:Partial<PCateory>)=>{
    const {name,description}=payload;

    return await prisma.pCateory.update({
        where:{
            id
        },
        data:{
           ...payload
        }
    })

}
const deleteCategory=async(id:string)=>{

    return await prisma.pCateory.delete({
        where:{
            id
        }
    })

}
const singleCategory=async(id:string)=>{

    return await prisma.pCateory.findUnique({
        where:{
            id
        }
    })

}


const allCategory=async(query:any)=>{
    const builder=new QueryBuilder(query,prisma.pCateory);
    const result=await builder
    .paginate()
    .execute();

    const meta=await builder.countTotal();

    return {
        meta,
        result
    }
}


export const CategoryService={
    createCategory,
    updateCategory,
    deleteCategory,
    allCategory,
    singleCategory
}