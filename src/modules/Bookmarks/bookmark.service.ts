import { Bookmark } from "@prisma/client"
import { prisma } from "../../prisma/client"


const addToBookmarks = (payload:Bookmark) => {
    return prisma.bookmark.create({
        data:payload
    })
}


const getMyBookmarks=async(id:string,userId:string)=>{
    return prisma.bookmark.findMany({
        where:{
            id:id,
            userId:userId
        }
    })
}

export const bookmarkService = {addToBookmarks,getMyBookmarks}