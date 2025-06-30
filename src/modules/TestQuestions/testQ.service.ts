import { TestQuestion } from '@prisma/client';
import { prisma } from '../../prisma/client';
import AppError from '../../errors/AppError';


export const AnswerTheTestQuestion = async (
  userId: string,
  payload: Partial<TestQuestion>
) => {
  const { testId, questionId, selected } = payload;

  if (!testId || !questionId || !selected) {
    throw new AppError(400, 'Test ID, Question ID, and Selected Answer are required.');
  }

  const question = await prisma.testQuestion.findUnique({
    where: { id: questionId },
    include: { test: true }
  });

  if (!question) {
    throw new AppError(404, 'Test Question not found.');
  }

  if (question.selected) {
    throw new AppError(409, 'You have already answered this question.');
  }

  const originalQuestion = await prisma.question.findUnique({
    where: { id: question.questionId }
  });

  if (!originalQuestion) {
    throw new AppError(404, 'Original Question not found.');
  }

  const isCorrect = selected === originalQuestion.correctAnswer;

  // Use a transaction for atomicity
  const [updatedQuestion, updatedResult, totalCorrect, totalQuestions] = await prisma.$transaction([
    // Update selected answer
    prisma.testQuestion.update({
      where: { id: questionId },
      data: {
        selected,
        isCorrect
      }
    }),

    // Update test result: increment score if correct
    prisma.testResult.update({
      where: {
        userId,
        testId,
        topicId: question.test.topicId
      },
      data: {
        score: isCorrect ? { increment: 1 } : undefined
      }
    }),

    // Get total correct answers so far
    prisma.testQuestion.count({
      where: {
        testId,
        userId,
        isCorrect: true
      }
    }),

    // Get total questions in this test
    prisma.testQuestion.count({
      where: {
        testId,
        userId
      }
    })
  ]);

  const percentage = (totalCorrect / totalQuestions) * 100;
  const isCompleted = totalCorrect === totalQuestions;

  const finalResult = await prisma.testResult.update({
    where: {
      userId,
      testId,
      topicId: question.test.topicId
    },
    data: {
      percentage,
      status: isCompleted ? 'COMPLETED' : undefined
    }
  });

  return {
    answer: updatedQuestion,
    testResult: finalResult
  };
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
