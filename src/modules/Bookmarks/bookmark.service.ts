import { Bookmark } from "@prisma/client"
import { prisma } from "../../prisma/client"


const addToBookmarks = (payload:Bookmark) => {
    return prisma.bookmark.create({
        data:payload
    })
}


const getMyBookmarks=async(userId:string)=>{
    return prisma.bookmark.findMany({
        where:{
            userId:userId
        },
        include:{
            question:{
                include:{
                    answers:true
                }
            },
            test:true
        }
    })
}

export const bookmarkService = {addToBookmarks,getMyBookmarks}