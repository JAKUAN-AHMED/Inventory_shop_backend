import { Test } from "@prisma/client";
import { prisma } from "../../prisma/client";

const createTest = async (payload: Test) => {
    // Logic to create a test
    return await prisma.test.create({
        data: payload
    });
};

const updateTest = async (id: string, payload: Partial<Test>) => {
    // Logic to update a test
    return await prisma.test.update({
        where: { id },
        data: payload
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
            testResults:true
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