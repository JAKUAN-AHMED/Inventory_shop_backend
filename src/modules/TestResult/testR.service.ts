import { TestResult } from "@prisma/client"
import { prisma } from "../../prisma/client"
import AppError from "../../errors/AppError";



// const createTestResult = async (payload: TestResult) => {
//   //   console.log("payload", payload);

//   // Get the latest test for this user (assuming 1 test at a time)
  
//   const latestTest = await prisma.test.findMany({
//     where: { userId: payload.userId },
//     orderBy: { createdAt: 'desc' },
//     take:2
//   });


//   console.log('result ',latestTest)
//   if (!latestTest) {
//     throw new AppError(404, "No test found for this user");
//   }

//   // payload.score = latestTest?.score! ?? 0;

//   //   console.log("payload score", payload.score);

//   // return await prisma.testResult.create({
//   //   data: payload,
//   // });

//   return {

//   }
// };

const getMyTestResult = async (userId: string) => {
  return await prisma.testResult.findMany({
    where: {
      userId
    },
    select:{
      id:true,
      percentage:true,
      score:true,
      topic:{
        select:{
          name:true
        }
      },
      createdAt:true,
      updatedAt:true
    },
    orderBy:{
      updatedAt:'asc'
    },
    take:2
  })
}

export const TestResultService = {
  // createTestResult,
  getMyTestResult
}