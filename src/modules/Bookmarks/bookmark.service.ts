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
            test:true,
            question:{
                include:{
                    bookmarks:true,
                    testQuestions:true,
                    comments:true
                }
            },
        }
    })
}

const deleteMyBookmark=async(userId:string,bookmarkId:string)=>{
    return await prisma.bookmark.delete({where:{userId,id:bookmarkId}});
}
const singleBookmark=async(userId:string,bookmarkId:string)=>{
    return await prisma.bookmark.findUnique({
        where:{userId,id:bookmarkId},
        include:{test:true,question:{include:{comments:true,bookmarks:true}}}
    });
}

export const bookmarkService = {addToBookmarks,getMyBookmarks,singleBookmark,deleteMyBookmark}