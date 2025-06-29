import { Test } from '@prisma/client';
import { prisma } from '../../prisma/client';
import AppError from '../../errors/AppError';
import { NotFound } from '../../utils/utility';

const createTest = async (payload: Test) => {
  if (!payload.topicId) {
    throw new AppError(404, 'Topic Not Found');
  }

  // 1. Check if user has a valid subscription
  const userInfo = await prisma.subscription.findUnique({
    where: {
      userId: payload.userId
    },
    include: {
      user: true,
      plan: {
        include: {
          license: {
            include: {
              licenseTopics: {
                where: {
                  topicId: payload.topicId
                },
                include: {
                  topic: {
                    include: {
                      questions: {
                        include: {
                          bookmarks: true,
                          comments: true
                        },
                        take: payload.total
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  // 2. Validate subscription
  if (!userInfo || userInfo.isActive !== true) {
    throw new AppError(403, 'You do not have an active subscription!');
  }

  // 3. Get related topic and questions
  const matchedLicenseTopic = userInfo.plan.license.licenseTopics?.[0]; // First match for topicId
  const selectedQuestions = matchedLicenseTopic?.topic?.questions ?? [];

  if (selectedQuestions.length === 0) {
    throw new AppError(404, 'No questions found for this topic.');
  }


  const testData={
    licenseId:matchedLicenseTopic.licenseId,
    userId:payload.userId,
    topicId:matchedLicenseTopic.topicId,
    total:payload.total
  }
  // 4. Create the Test
  const test = await prisma.test.create({
    data: testData,
  });

  if (!test) {
    throw new AppError(400, 'Failed to create Test.');
  }

  // 5. Create Test Questions
  const testQuestions = await prisma.testQuestion.createMany({
    data: selectedQuestions.map((question) => ({
      questionId: question.id,
      testId: test.id,
      timeLimit: 1,
      userId:payload.userId
    }))
  });

  if (!testQuestions || testQuestions.count === 0) {
    throw new AppError(400, 'Failed to create Test Questions.');
  }

  // 6. Create Test Result
  await prisma.testResult.create({
    data: {
      userId: payload.userId,
      topicId: payload.topicId,
      testId: test.id,
    },
  });

  // 7. Return
  return {
    ...test,
    questionCount: selectedQuestions.length,
    testQuestionsCount: testQuestions.count,
    questions: selectedQuestions,
  };
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
