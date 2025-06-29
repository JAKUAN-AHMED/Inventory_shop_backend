import { Test } from '@prisma/client';
import { prisma } from '../../prisma/client';
import AppError from '../../errors/AppError';
import { NotFound } from '../../utils/utility';

const createTest = async (payload: Test) => {
  // console.log("payload ", payload);


  //check user have subscription
  const userInfo = await prisma.subscription.findUnique({
    where: {
      userId:payload.userId
    },
    include:{
      user:true,
      plan:{
        include:{
          license:{
            include:{
              topics:{
                include:{
                  questions:{
                    include:{
                      bookmarks:true,
                      comments:true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })


  console.log('userInfo',userInfo)
  if(!userInfo?.isActive)
  {
    throw new AppError(403,'You Do not Have Active Susbcription!');
  }

  return {};
  // // 1. Fetch random questions from the topic
  // const questions = await prisma.question.findMany({
  //   where: {
  //     topicId: payload.topicId,
  //   },
  //   select: {
  //     id: true,
  //     // correctAnswer:true,
  //     comments: {
  //       select: {
  //         upVote: true,
  //         downVote: true,
  //       },
  //     },

  //     // topicId is not needed unless you need it later
  //   },

  //   take: payload.total,
  // });

  // // console.log("questions", questions);

  // if (questions.length === 0) {
  //   throw new AppError(404, 'No questions found for this topic.');
  // }

  // // 2. Create the Test (must come BEFORE using testId)
  // const test = await prisma.test.create({
  //   data: payload,
  // });

  // if (!test) {
  //   throw new AppError(400, 'Failed to create Test.');
  // }

  // // 3. Create related TestQuestions
  // const testQuestions = await prisma.testQuestion.createMany({
  //   data: questions.map((question) => ({
  //     questionId: question.id,
  //     testId: test.id,
  //     timeLimit: 1,
  //   })),
  // });

  // //   console.log("testQuestions", testQuestions);

  // if (!testQuestions || testQuestions.count === 0) {
  //   throw new AppError(400, 'Failed to create Test Questions.');
  // }

  // //create testResult

  // await prisma.testResult.create({
  //   data: {
  //     userId: payload.userId,
  //     topicId: payload.topicId,
  //     testId: test.id,
  //   },
  // });
  // // 4. Return test and selected questions
  // return {
  //   ...test,
  //   ...testQuestions,
  //   questions,
  // };
};

const updateTest = async (id: string, payload: Partial<Test>) => {
  // Check if the test exists
  const isExists = await prisma.test.findUnique({
    where: { id },
  });

  if (!isExists) {
    throw new Error('Test not found');
  }

  // Logic to update a test
  return await prisma.test.update({
    where: { id },
    data: {
      status: payload.status,
    },
  });
};

const deleteTest = async (id: string, userId: string) => {
  return await prisma.$transaction(async (tx) => {
    const isTestExist = await tx.test.findUnique({ where: { id } });
    await NotFound(isTestExist, 'Test');

    // Delete test questions
    await tx.testQuestion.deleteMany({ where: { testId: id } });

    // Delete bookmarks linked to test
    await tx.bookmark.deleteMany({ where: { testId: id } });

    // Delete test results linked to test
    await tx.testResult.deleteMany({ where: { testId: id } });

    // Finally, delete the test
    return await tx.test.delete({
      where: {
        id,
        userId,
      },
    });
  });
};


const AllTests = async () => {
  // Logic to get all tests
  return await prisma.test.findMany({
    include: {
      bookmarks: true,
      questions: true,
      testResults: true,
    },
  });
};

const TestById = async (id: string, userId: string, role: string) => {
  // Logic to get a test by ID
  if (role === 'ADMIN') {
    return await prisma.test.findUnique({
      where: { id },
      include: {
        bookmarks: true,
        questions: true,
        testResults: true,
      },
    });
  }
  else {
    return await prisma.test.findUnique({
      where: { id, userId },
      include: {
        bookmarks: true,
        questions: true,
        testResults: true,
      },
    });
  }
};

const testByUserId = async (userId: string) => {
  return await prisma.test.findMany({
    where: {
      userId,
    },
    include: {
      bookmarks: true,
      questions: {
        include: {
          question: {
            include: {
              bookmarks: true,
              comments: true
            }
          }
        }
      },
      testResults: true,
    },
  });
};

export const TestService = {
  createTest,
  updateTest,
  deleteTest,
  AllTests,
  TestById,
  testByUserId
};
