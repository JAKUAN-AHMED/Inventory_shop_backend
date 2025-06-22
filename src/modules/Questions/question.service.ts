import { Question } from "@prisma/client"
import { prisma } from "../../prisma/client"

const createQuestion = async (payload: Question) => {
    return await prisma.question.create({
        data: payload
    })
}



const updateQuestion = async (id: string, payload: Partial<Question>) => {
    return await prisma.question.update({
        where: { id },
        data: payload
    })
}


const deleteQuestion = async (id: string) => {
    return await prisma.question.delete({
        where: { id }
    })
}


const AllQuestions = async () => {
    return await prisma.question.findMany(
        {
           
            include: {
                answers: true,
                bookmarks: true,
                comments: true,
                testQuestions: true
            }
        }
    )
}


const QuestionById = async (id: string) => {
    return await prisma.question.findUnique({
        where: { id },

        include: {
            answers: true,
            bookmarks: true,
            comments: true,
            testQuestions: true

        }
    })
}

export const QuestionService = {
    createQuestion,
    updateQuestion,
    deleteQuestion,
    AllQuestions,
    QuestionById
}