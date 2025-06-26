import { Answer } from "@prisma/client";
import { prisma } from "../../prisma/client";
import AppError from "../../errors/AppError";

const createAnswer = async (payload: Answer) => {



    const isExistQuestions = await prisma.answer.findFirst({
        where: {
            questionId: payload?.questionId,
        }
    })

    if (isExistQuestions && isExistQuestions?.isCorrect && payload.isCorrect) {
        throw new AppError(409, 'Already isCorrect True assigned');
    }


    const isFour = await prisma.answer.count({
        where: {
            questionId: payload.questionId,
        }
    })

    if (isFour === 3 && payload.isCorrect === false) {
        const count = await prisma.answer.count({
            where: {
                questionId: payload.questionId,
                isCorrect: true
            }
        })

        if (count == 0) {
            throw new AppError(400, 'At least one answer should be isCorrect true');
        }
    }


    if (isFour == 4) {
        throw new AppError(409, 'Already have 4 Answered');
    }
    return await prisma.answer.create({
        data: payload
    });

}

const updateAnswer = async (id: string, payload: Partial<Answer>) => {
    return await prisma.answer.update({
        where: { id },
        data: payload
    });
}

const deleteAnswer = async (id: string) => {
    return await prisma.answer.delete({
        where: { id }
    });
}

const AllAnswers = async () => {
    return await prisma.answer.findMany({
        include: {
            question: true,
        }
    });
}

const AnswerById = async (id: string) => {
    return await prisma.answer.findUnique({
        where: { id },
        include: {
            question: true,
        }
    });
}
export const AnswerService = {
    createAnswer,
    updateAnswer,
    deleteAnswer,
    AllAnswers,
    AnswerById
}