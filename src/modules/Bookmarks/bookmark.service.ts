import { Bookmark } from "@prisma/client"
import { prisma } from "../../prisma/client"
import { NotFound } from "../../utils/utility";
import AppError from "../../errors/AppError";
import QueryBuilder from "../../builder/QueryBuilder";


const addToBookmarks = async (payload: Bookmark) => {

    const { testId, questionId } = payload;

    const isExistTest = await prisma.test.findUnique({
        where: {
            id: testId as string
        }
    })

    await NotFound(isExistTest, 'Test');

    const isExistBookmark = await prisma.question.findUnique({
        where: {
            id: questionId
        }
    })

    await NotFound(isExistBookmark, "Bookmark");
    const isQuestionExist=await prisma.question.findUnique({
        where:{
            id:questionId
        }
    })

    await NotFound(isQuestionExist,'Question');

    const isAlreadyBookMarkExist=await prisma.bookmark.findFirst({
        where:{
            userId:payload.userId as string,
            questionId:payload.questionId as string
        }
    })

    if(isAlreadyBookMarkExist){
        throw new AppError(409,'Already Exist BookMark For This Question');
    }
    return prisma.bookmark.create({
        data: payload
    })
}


export const getMyBookmarks = async (userId: string, query: any) => {
  const staticFilter = { userId };

  const queryBuilder = new QueryBuilder(query, prisma.bookmark, staticFilter);

  const select = {
    id: true,
    test: {
      select: {
        topic: {
          select: {
            name: true,
          },
        },
        license: {
          select: {
            name: true,
          },
        },
      },
    },
    question: {
      select: {
        text: true,
        options: true,
        explanation: true,
        correctAnswer: true,
        comments: {
          select: {
            text: true,
            user: {
              select: {
                name: true,
              },
            },
            upVote: {
              select: {
                vote: true,
              },
            },
            downVote: {
              select: {
                vote: true,
              },
            },
            replies: {
              select: {
                text: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const bookmarks = await queryBuilder
    .paginate()
    .sort(["createdAt"]) // optional, or pass user-defined `query.sort`
    .getAllQueries()
  const data = await prisma.bookmark.findMany({
    ...bookmarks,
    select,
  });

  const paginationMeta = await queryBuilder.countTotal();

  return {
    meta: paginationMeta,
    data,
  };
};

const deleteMyBookmark = async (userId: string, bookmarkId: string) => {
    const isExistBookmark=await prisma.bookmark.findUnique({
        where:{
            id:bookmarkId,
            userId
        }
    })

    await NotFound(isExistBookmark,'Bookmark');
    return await prisma.bookmark.delete({ where: { userId, id: bookmarkId } });
}
const singleBookmark = async (userId: string, bookmarkId: string) => {
    const isExistBookmark=await prisma.bookmark.findUnique({
        where:{
            id:bookmarkId,
            userId
        }
    })

    await NotFound(isExistBookmark,'Bookmark');
    return await prisma.bookmark.findUnique({
        where: {
            id:bookmarkId,
            userId: userId
        },
        select: {
            id:true,
            test: {
                select: {
                    topic: {
                        select: {
                            name: true
                        }
                    },
                    license: {
                        select: {
                            name: true,
                        }
                    }
                }
            },
            question: {
                select: {
                    text: true,
                    options: true,
                    explanation: true,
                    correctAnswer: true,
                    comments: {
                        select: {
                            replies: {

                                select: {
                                    text: true,
                                    user: {
                                        select: {
                                            name: true
                                        }
                                    }
                                }
                            },
                            text: true,
                            upVote: {
                                select: {
                                    vote: true
                                }
                            },
                            downVote: {
                                select: {
                                    vote: true
                                }
                            },
                            user: {
                                select: {
                                    name: true,
                                }
                            }
                        }
                    }
                }
            },
        }
    });
}

export const bookmarkService = { addToBookmarks, getMyBookmarks, singleBookmark, deleteMyBookmark }