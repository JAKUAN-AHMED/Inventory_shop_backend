import { Test } from "@prisma/client";
import { prisma } from "../../prisma/client";

const createTest = async (payload: Test) => {

    const questions=await prisma.question.findMany({
        where:{
            topicId:payload.topicId
        },
        include:{
            answers:true,
            bookmarks:true,
            testQuestions:true,
            comments:true

        },
        take:payload.total
    })


    //create test questions
    const testQuestions=await prisma.testQuestion.createMany({
        data: questions.map((question) => ({
            questionId: question.id,
            testId: payload.id
        })) 
    });

    // Logic to create a test
    const result= await prisma.test.create({
        data: payload
    });

    return {
        ...result,
        questions: questions
    }
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
            questions:true,
            testResults:true,
        }
    });
};

const TestById = async (id: string) => {
    // Logic to get a test by ID
    return await prisma.test.findUnique({
        where: { id },
        include: {
            bookmarks: true,
            questions:true,
            testResults:true
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