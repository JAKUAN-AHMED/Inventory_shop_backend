import { Comment, DownVote } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { NotFound } from "../../utils/utility";


const createCommnent = async (userId:string,payload: Comment) => {
    const { questionId,text } = payload;
    return await prisma.comment.create({
        data: {
            questionId,
            userId,
            text
        }
    })
}


const updateComment = async (id: string, payload: Partial<Comment>) => {
    const { text } = payload;
    return await prisma.comment.update({
        where: {
            id
        },
        data: {
            text
        }
    })
}

const deleteComment = async (id: string) => {

    const isExistComment=await prisma.comment.findUnique({
    where:{
        id
    }
    })

    await NotFound(isExistComment,'Comment');


    const upvote=await prisma.upVotes.findFirst({
        where:{
            commentId:id
        }
    })

    if(upvote)
    {
        await prisma.upVotes.deleteMany({
            where:{
                commentId:id
            }
        })
    }
    const downvote=await prisma.downVote.findFirst({
        where:{
            commentId:id
        }
    })

    if(downvote)
    {
        await prisma.downVote.deleteMany({
            where:{
                commentId:id
            }
        })
    }
    const reply=await prisma.reply.findFirst({
        where:{
            commentId:id
        }
    })

    if(reply)
    {
        await prisma.reply.deleteMany({
            where:{
                commentId:id
            }
        })
    }



    //now savely delete

    return await prisma.comment.delete({
        where: {
            id
        }
    })
}


const downVoteToComment = async (payload:DownVote) => {
    const { commentId, userId,vote } = payload;
    return await prisma.downVote.create({
        data: {
            commentId,
            userId,
            vote
        }
    })
}

const upVoteToComment = async (payload:DownVote) => {
    const { commentId, userId,vote } = payload;
    return await prisma.downVote.create({
        data: {
            commentId,
            userId,
            vote
        }
    })
}


const removeDownVoteFromComment = async (id: string) => {
    return await prisma.downVote.delete({
        where: {
            id
        }
    })
}   

const removeUpVoteFromComment = async (id: string) => {
    return await prisma.downVote.delete({
        where: {
            id
        }
    })
}

const getComment = async (id: string) => {
    return await prisma.comment.findUnique({
        where: {
            id
        },
        include: {
            user: true,
            downVote: true,
            upVote: true
        }
    })
}

const getComments=async()=>{
    return await prisma.comment.findMany({
        include: {
            user: true,
            downVote: true,
            upVote: true
        }
    })
}
export const CommentService = {
    createCommnent,
    updateComment,
    deleteComment,
    downVoteToComment,
    upVoteToComment,
    removeDownVoteFromComment,
    removeUpVoteFromComment,
    getComment,
    getComments
}