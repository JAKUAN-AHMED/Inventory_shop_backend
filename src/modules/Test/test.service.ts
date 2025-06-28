import { Test } from "@prisma/client";
import { prisma } from "../../prisma/client";
import AppError from "../../errors/AppError";

const createTest = async (payload: Omit<Test, 'id'> & { total: number }) => {
  // console.log("payload ", payload);

  // 1. Fetch random questions from the topic
  const questions = await prisma.question.findMany({
    where: {
      topicId: payload.topicId,
    },
    select: {
      id: true,
      // correctAnswer:true,
      comments: {
        select:{
          upVote:true,
          downVote:true
        }
      },
     
      // topicId is not needed unless you need it later
    },
    
    take: payload.total,
  });

  // console.log("questions", questions);

  if (questions.length === 0) {
    throw new AppError(404, "No questions found for this topic.");
  }

  // 2. Create the Test (must come BEFORE using testId)
  const test = await prisma.test.create({
    data: payload,
  });

  if (!test) {
    throw new AppError(400, "Failed to create Test.");
  }

  // 3. Create related TestQuestions
  const testQuestions = await prisma.testQuestion.createMany({
    data: questions.map((question) => ({
      questionId: question.id,
      testId: test.id,
      timeLimit: 1
    }))
  });

//   console.log("testQuestions", testQuestions);

  if (!testQuestions || testQuestions.count === 0) {
    throw new AppError(400, "Failed to create Test Questions.");
  }


  //create testResult 

  await prisma.testResult.create({
    data:{
      userId:payload.userId,
      topicId:payload.topicId,
      testId:test.id

    }
  })
  // 4. Return test and selected questions
  return {
    ...test,
    ...testQuestions,
    questions,
  };
};

const updateTest = async (id: string, payload: Partial<Test>) => {




    // Check if the test exists
    const isExists = await prisma.test.findUnique({
        where: { id }
    });

    if (!isExists) {
        throw new Error('Test not found');
    }

    // Logic to update a test
    return await prisma.test.update({
        where: { id },
        data: {
            status: payload.status,
        }
    });
};

const deleteTest = async (id: string) => {
    // Logic to delete a test
    return await prisma.test.delete({
        where: { id }
    });
};

const AllTests = async () => {
    // Logic to get all tests
    return await prisma.test.findMany({
        include: {
            bookmarks: true,
            questions: true,
            testResults: true,
        }
    });
};

const TestById = async (id: string) => {
    // Logic to get a test by ID
    return await prisma.test.findUnique({
        where: { id },
        include: {
            bookmarks: true,
            questions: true,
            testResults: true
        }
    });
};




export const TestService = {

    createTest,
    updateTest,
    deleteTest,
    AllTests,
    TestById
}