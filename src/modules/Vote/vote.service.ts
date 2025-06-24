import { DownVote, UpVotes } from "@prisma/client"
import { prisma } from "../../prisma/client";
import AppError from "../../errors/AppError";

const giveUpvote = async (payload: UpVotes) => {
    const { commentId, vote, userId } = payload;
    if (vote !== 1 && vote !== 0) {
        throw new AppError(404,"vote either zero or one");
        // handle invalid vote value here, e.g., throw an error or return
    }
    return await prisma.upVotes.create({
        data: {
            commentId,
            vote,
            userId
        }
    })
}

const giveDownVote = async (payload: DownVote) => {
    const { commentId, vote, userId } = payload;
      if (vote !== 1 && vote !== 0) {
        throw new AppError(404,"vote either zero or one");
        // handle invalid vote value here, e.g., throw an error or return
    }
    return await prisma.upVotes.create({
        data: {
            commentId,
            vote,
            userId
        }
    })
}



export const VoteService = {
    giveUpvote,
    giveDownVote
}