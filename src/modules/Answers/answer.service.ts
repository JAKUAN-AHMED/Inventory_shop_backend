import { Answer } from "@prisma/client";
import { prisma } from "../../prisma/client";

const createAnswer = async (payload:Answer) => {
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