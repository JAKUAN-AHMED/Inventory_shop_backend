import { TestQuestion } from '@prisma/client';
import { prisma } from '../../prisma/client';
import AppError from '../../errors/AppError';

const AnswerTheTestQuestion = async (
  userId: string,
  id: string,
  payload: Partial<TestQuestion>,
) => {
  const { testId, questionId, selected } = payload;

  if (!testId || !questionId) {
    throw new Error('id is required');
  }

  // Check if the test question exists
  const isExists = await prisma.testQuestion.findUnique({
    where: { id },
  });

  if (!isExists) {
    throw new Error('Test Question not found');
  }

  //total test questions
  const totalquestions = await prisma.testQuestion.count({
    where: {
      id,
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
      testId: testId,
      topicId: isTestExists.topicId,
    },
    select: {
      score: true,
    },
  });
  // Check if the question exists
  const isQuestionExists = await prisma.question.findUnique({
    where: { id: questionId },
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
      where: { id: testId, questionId },
      data: {
        isCorrect: true,
      },
    });

    const testResult = await prisma.testResult.update({
      where: {
        userId,
        testId: testId,
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
      where: { id: testId, questionId },
      data: {
        isCorrect: false,
      },
    });

    const testResult = await prisma.testResult.findUnique({
      where: {
        userId,
        testId: testId,
        topicId: isTestExists.topicId,
      },
    });

    return {
      answer,
      testResult,
    };
  }
};

export const testQService = {
  AnswerTheTestQuestion,
};
