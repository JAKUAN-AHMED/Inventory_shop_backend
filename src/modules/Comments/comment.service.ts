import { Comment, DownVote, UpVotes } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { isExistUserById, NotFound } from '../../utils/utility';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';

const createCommnent = async (userId: string, payload: Comment) => {
  const { questionId, text } = payload;
  return await prisma.comment.create({
    data: {
      questionId,
      userId,
      text,
    },
  });
};

const updateComment = async (
  id: string,
  userId: string,
  payload: Partial<Comment>,
) => {
  const isExistComment = await prisma.comment.findUnique({
    where: {
      id,
      userId,
    },
  });

  await NotFound(isExistComment, 'Comment');
  const { text } = payload;
  return await prisma.comment.update({
    where: {
      id,
      userId,
    },
    data: {
      text,
    },
  });
};

const deleteComment = async (id: string, userId: string, role: string) => {
  if (role !== 'ADMIN') {
    return await prisma.$transaction(async (tx) => {
      const isExistComment = await tx.comment.findUnique({
        where: { id, userId },
      });

      await NotFound(isExistComment, 'Comment');

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
        where: { id, userId },
      });
    });
  }
  else {
    return await prisma.$transaction(async (tx) => {
      const isExistComment = await tx.comment.findUnique({
        where: { id },
      });

      await NotFound(isExistComment, 'Comment');

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
  }
};

const downVoteToComment = async (payload: DownVote) => {
   const { commentId, userId } = payload;
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId
    }
  })
  await NotFound(comment, 'Comment');
 


  const isAlreadyVoted = await prisma.downVote.findFirst({
    where: {
      userId,
    },
  });

  let vote = 1;
  if (isAlreadyVoted && isAlreadyVoted?.vote===1) {
    vote = 0;
    return await prisma.downVote.update({
      where: {
        userId
      },
      data: {
        vote,
        isVoted:false
      }
    });
  }
  else if (isAlreadyVoted && isAlreadyVoted?.vote===0) {
    return await prisma.downVote.update({
      where: {
        userId
      },
      data: {
        vote,
        isVoted:true
      }
    });
  }
  else{
    return await prisma.upVotes.create({
    data: {
      vote,
      isVoted:true,
      commentId,
      userId
    }
  });
  }
};

const upVoteToComment = async (payload: UpVotes) => {
  const { commentId, userId } = payload;
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId
    }
  })
  await NotFound(comment, 'Comment');
 


  const isAlreadyVoted = await prisma.upVotes.findFirst({
    where: {
      userId,
    },
  });

  let vote = 1;
  if (isAlreadyVoted && isAlreadyVoted?.vote===1) {
    vote = 0;
    return await prisma.upVotes.update({
      where: {
        userId
      },
      data: {
        vote,
        isVoted:false
      }
    });
  }
  else if (isAlreadyVoted && isAlreadyVoted?.vote===0) {
    return await prisma.upVotes.update({
      where: {
        userId
      },
      data: {
        vote,
        isVoted:true
      }
    });
  }
  else{
    return await prisma.upVotes.create({
    data: {
      vote,
      isVoted:true,
      commentId,
      userId
    }
  });
  }
};

// const removeDownVoteFromComment = async (id: string) => {
//   return await prisma.downVote.delete({
//     where: {
//       id,
//     },
//   });
// };

// const removeUpVoteFromComment = async (id: string) => {
//   return await prisma.downVote.delete({
//     where: {
//       id,
//     },
//   });
// };

const getComment = async (id: string, userId: string) => {
  return await prisma.comment.findUnique({
    where: {
      id,
      userId,
    },
    include: {
      user: true,
      downVote: true,
      upVote: true,
    },
  });
};

const getComments = async (userId: string, role: string, query: any) => {
  await isExistUserById(userId);
  if (role !== 'ADMIN') {
    const builder = new QueryBuilder(query, prisma.comment);
    const result = await builder
      .paginate()
      .include({
        user: true,
        downVote: true,
        upVote: true,
      })
      .execute();

    const meta = await builder.countTotal();

    return {
      result,
      meta,
    };
  } else {
    const builder = new QueryBuilder(query, prisma.comment);
    const result = await builder
      .rawFilter({
        userId,
      })
      .paginate()
      .include({
        user: true,
        downVote: true,
        upVote: true,
      })
      .execute();

    const meta = await builder.countTotal();
    return {
      result,
      meta,
    };
  }
};
export const CommentService = {
  createCommnent,
  updateComment,
  deleteComment,
  downVoteToComment,
  upVoteToComment,
  //   removeDownVoteFromComment,
  //   removeUpVoteFromComment,
  getComment,
  getComments,
};
