import { Reply } from "@prisma/client"
import { prisma } from "../../prisma/client";

const createReply=async(payload:Reply)=>{
    const {commentId,userId,text}=payload;
    return await prisma.reply.create({
        data: {
            commentId: commentId,
            userId: userId,
            text: text
        }
    })
}

const updateReply=async(id:string,payload:Partial<Reply>)=>{
    const {text}=payload;
    return await prisma.reply.update({
        where: {
            id
        },
        data: {
            text: text
        }
    })
}
const deleteReply=async(id:string)=>{
    return await prisma.reply.delete({
        where: {
            id
        }
    })
}

export const ReplyService={
    createReply,
    updateReply,
    deleteReply
}