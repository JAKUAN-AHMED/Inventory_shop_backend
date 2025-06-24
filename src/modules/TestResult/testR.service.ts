import { TestResult } from "@prisma/client"
import { prisma } from "../../prisma/client"



const createTestResult = async (payload: TestResult) => {


    const score = await prisma.test.findMany({
        where: {
            userId: payload.userId,
        },
        select: {
            score: true
        }
    })
    payload.score = score[0].score as number;

    return await prisma.testResult.create({
        data: payload
    })
}
const getTestResult = async (id: string, userId: string) => {
    return await prisma.testResult.findUnique({
        where: {
            id: id,
            userId: userId
        }
    })
}

export const TestResultService = {
    createTestResult,
    getTestResult
}