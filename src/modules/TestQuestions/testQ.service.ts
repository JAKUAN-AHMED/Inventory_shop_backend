import { TestQuestion } from '@prisma/client';
import { prisma } from '../../prisma/client';
import AppError from '../../errors/AppError';

const AnswerTheTestQuestion = async (
  userId: string,
  payload: Partial<TestQuestion>,
) => {
  const { testId, questionId, selected } = payload;

  if (!testId || !questionId || !selected) {
    throw new Error('id is required');
  }

  // Check if the test question exists
  const isExists = await prisma.testQuestion.findUnique({
    where: { id: payload.questionId },
  });

  if (!isExists) {
    throw new Error('Test Question not found');
  }

  //total test questions
  const totalquestions = await prisma.testQuestion.count({
    where: {
      id: questionId,
    },
  });

  const selectedCount = await prisma.testQuestion.count({
    where: {
      testId,
      isCorrect: true
    }
  })

  let isCompleted: boolean = false;
  if (selectedCount === totalquestions) {
    isCompleted = true;
    throw new AppError(400, 'Your Test is Already Completed');
  }
  if (isExists.selected) {
    throw new AppError(409, 'You have Already Answered This Question');
  }
  // Check if the test exists
  const isTestExists = await prisma.test.findUnique({
    where: { id: testId },
  });
  if (!isTestExists) {
    throw new Error('Test not found');
  }

  //total score
  const totalscore = await prisma.testResult.findUnique({
    where: {
      userId,
      testId,
      topicId: isTestExists.topicId,
    },
    select: {
      score: true,
    },
  });
  // Check if the question exists
  const isQuestionExists = await prisma.question.findUnique({
    where: { id: isExists.questionId },
  });
  if (!isQuestionExists) {
    throw new Error('Question not found');
  }
  const { correctAnswer } = isQuestionExists;
  if (!selected) {
    throw new Error('Selected answer is required');
  }

  if (selected === correctAnswer) {
    const answer = await prisma.testQuestion.update({
      where: {
        id: questionId
      },
      data: {
        isCorrect: true,
        selected: payload.selected
      }
    })

    if (selectedCount === (totalquestions - 1)) {
      isCompleted = true;
    }

    let testResult = await prisma.testResult.update({
      where: {
        testId: testId as string,
        topicId: isTestExists.topicId,
      },
      data: {
        score: {
          increment: 1,
        },
      },
    });


    const scoreData = testResult?.score ? testResult.score : 0;
    const questionData = totalquestions ? totalquestions : 0;
    const percentageData = (scoreData / questionData) * 100
    // console.log('score , questions',scoreData,questionData)


    testResult = await prisma.testResult.update({
      where: {
        testId: testId as string,
        topicId: isTestExists.topicId,
      },
      data: {
        percentage: Number(percentageData),
      },
    });
    return {
      answer,
      testResult,
    };
  } else {
    const answer = await prisma.testQuestion.update({
      where: {
        testId_questionId: {
          testId: testId,
          questionId: payload.questionId as string,
        }
      },
      data: {
        isCorrect: false,
        selected: payload.selected
      },
    });

    const testResult = await prisma.testResult.findUnique({
      where: {
        id: testId,
        topicId: isTestExists.topicId,
      },
    });

    return {
      answer,
      testResult,
    };
  }
};

//test questions data

const MyQuestions = async (userId: string, query: any, testId: string) => {
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 1;
  const skip = (Number(page) - 1) * Number(limit);

  // 1. Total count
  const total = await prisma.testQuestion.count({
    where: {
      userId,
      testId
    }
  });
  // console.log(total) 
  // 2. Paginated questions
  const questions = await prisma.testQuestion.findMany({
    where: { userId, testId },
    skip: Number(skip),
    take: Number(limit),
    include: {
      question: {
        include: {
          bookmarks: true,
          comments: {
            include: {
              upVote: true,
              downVote: true,
            }
          }
        }
      }
    }
  });

  // 3. Return result with meta
  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: questions
    },
  };
};


export const testQService = {
  AnswerTheTestQuestion,
  MyQuestions
};
