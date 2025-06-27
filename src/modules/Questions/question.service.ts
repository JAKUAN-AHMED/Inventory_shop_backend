import { Question } from "@prisma/client"
import { prisma } from "../../prisma/client"
import QueryBuilder from "../../builder/QueryBuilder"
import { isValidOptions, NotFound } from "../../utils/utility"
import AppError from "../../errors/AppError"


type optionsType = {
    label: "A" | "B" | "C" | "D",
    value: string
}

const createQuestion = async (payload: Question & { options: optionsType[] }) => {
    const {options, explanation, topicId, text, correctAnswer } = payload;
    if (!isValidOptions(options)) {
        throw new AppError(400, "options type is not acceptable");
    }
    return await prisma.question.create({
        data: {
            options,
            explanation,
            topicId,
            text,
            correctAnswer
        }
    })
}



const updateQuestion = async (id: string, payload: Partial<Question>) => {

    const { options, correctAnswer } = payload;
    if (!isValidOptions(options)) {
        throw new AppError(400, "options type is not acceptable");
    }
    return await prisma.question.update({
        where: { id },
        data: {
            options,
            correctAnswer
        }
    })
}


const deleteQuestion = async (id: string) => {

    const isExistQuestions = await prisma.question.findUnique({
        where: {
            id
        }
    })

    await NotFound(isExistQuestions, "Questions You are trying to Delete ,Its Already Deleted and Id");


    await prisma.testQuestion.deleteMany({
        where: {
            questionId: id
        }
    })
    return await prisma.question.delete({
        where: { id }
    })
}


const AllQuestions = async (query: any) => {

    const builder = new QueryBuilder(query, prisma.question);
    const result = await builder
        .paginate()
        .include(
            {
                anwer: true,
                bookmarks: true,
                comments: {
                    include: {
                        upVote: {
                            select: {
                                vote: true
                            }
                        },
                        downVote: {
                            select: {
                                vote: true
                            }
                        }
                    }
                },
                testQuestions: true,
                explanation: true,
            }
        )
        .execute();
    const meta = await builder.countTotal();

    return {
        data: result,
        meta
    }
}


const QuestionById = async (id: string) => {
    return await prisma.question.findUnique({
        where: { id },

        include: {
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