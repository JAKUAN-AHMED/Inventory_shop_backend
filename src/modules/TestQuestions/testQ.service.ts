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
    where: { id:payload.questionId },
  });

  if (!isExists) {
    throw new Error('Test Question not found');
  }

  //total test questions
  const totalquestions = await prisma.testQuestion.count({
    where: {
      id:questionId,
    },
  });

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

  if (testId && selected === correctAnswer) {
    const answer = await prisma.testQuestion.update({
      where:{
        id:questionId
      },
      data:{
        isCorrect:true,
        selected:payload.selected
      }
    })

    const testResult = await prisma.testResult.update({
      where: {
        testId: testId as string,
        topicId: isTestExists.topicId,
      },
      data: {
        percentage: ((totalscore?.score ?? 0) / (totalquestions || 1)) * 100,
        score: {
          increment: 1,
        },
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

const MyQuestions = async (userId: string, page: number = 1) => {
  const limit = 1;
  const skip = (page - 1) * limit;

  // 1. Get total count
  const total = await prisma.testQuestion.count({
    where: {
      userId
    }
  });

  // 2. Fetch the paginated question
  const questions = await prisma.testQuestion.findMany({
    where: { userId },
    skip,
    take: limit,
    include: {
      question: {
        include: {
          bookmarks: true,
          comments: {
            include: {
              upVote: true,
              downVote: true
            }
          }
        }
      }
    }
  });

  // 3. Return with meta
  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: questions
    }
  };
};

export const testQService = {
  AnswerTheTestQuestion,
  MyQuestions
};
