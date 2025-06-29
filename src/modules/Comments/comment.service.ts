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
  return await prisma.$transaction(async (tx) => {
    const isExistComment = await tx.comment.findUnique({
      where: { id },
    });

    await NotFound(isExistComment, "Comment");

    // Delete related upvotes
    await tx.upVotes.deleteMany({
      where: { commentId: id },
    });

    // Delete related downvotes
    await tx.downVote.deleteMany({
      where: { commentId: id },
    });

    // Delete replies
    await tx.reply.deleteMany({
      where: { commentId: id },
    });

    // Now safely delete the comment
    return await tx.comment.delete({
      where: { id },
    });
  });
};




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