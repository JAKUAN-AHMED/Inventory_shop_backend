import { Answer } from "@prisma/client";
import { prisma } from "../../prisma/client";
import AppError from "../../errors/AppError";

const createAnswer = async (payload: Answer) => {



    // const isExistQuestions = await prisma.answer.findUnique({
    //     where: {
    //         questionId: payload?.questionId,
    //         userId:payload.userId
    //     }
    // })

    // if(isExistQuestions)
    // {
    //     throw new AppError(409,'Already Exist Same Answer of same User');
    // }

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