import { TestQuestion } from "@prisma/client"
import { prisma } from "../../prisma/client"

const updateTestQuestion = async (id: string, payload: Partial<TestQuestion>) => {

    const { testId, questionId, selected } = payload;

    if (!testId || !questionId) {
        throw new Error('id is required');
    }

    // Check if the test question exists
    const isExists = await prisma.testQuestion.findUnique({
        where: { id }
    });
    if (!isExists) {
        throw new Error('Test Question not found');
    }
    // Check if the test exists
    const isTestExists = await prisma.test.findUnique({
        where: { id: testId }
    });
    if (!isTestExists) {
        throw new Error('Test not found');
    }
    // Check if the question exists
    const isQuestionExists = await prisma.question.findUnique({
        where: { id: questionId },
        include: {
            answer: true
        }
    });
    if (!isQuestionExists) {
        throw new Error('Question not found');
    }
    const { answer } = isQuestionExists;
    if (!selected) {
        throw new Error('Selected answer is required');
    }
    const isAnswerCorrect = answer[selected]?.SelectedOption;

    // payload.CorrectAnswer = isAnswerCorrect;
    // payload.answerId = answers[selected]?.id;

    //calculate score
    if (isAnswerCorrect) {

        const score = await prisma.test.update({
            where: { id: testId },
            data:{
                score:{
                    increment: 1
                }
            }
        })
       
    }
    // Logic to update a test question
    return await prisma.testQuestion.update({
        where: { id },
        data: payload
    });
}


export const testQService = {
    updateTestQuestion
}