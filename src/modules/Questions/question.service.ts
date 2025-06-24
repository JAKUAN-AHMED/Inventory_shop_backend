import { Question } from "@prisma/client"
import { prisma } from "../../prisma/client"
import QueryBuilder from "../../builder/QueryBuilder"
import { NotFound } from "../../utils/utility"

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

    const isExistQuestions=await prisma.question.findUnique({
        where:{
            id
        }
    })

    await NotFound(404,"Questions You are trying to Delete ,Its Already Deleted and Id");

    await prisma.answer.deleteMany({
        where:{
            questionId:id
        }
    })

    await prisma.testQuestion.deleteMany({
        where:{
            questionId:id
        }
    })
    return await prisma.question.delete({
        where: { id }
    })
}


const AllQuestions = async (query:any) => {

    const builder=new QueryBuilder(query,prisma.question);
    const result=await builder
    .paginate()
    .include(
        {
                answers: true,
                bookmarks: true,
                comments:{
                    include:{
                        upVote:{
                            select:{
                                vote:true
                            }
                        },
                        downVote:{
                            select:{
                                vote:true
                            }
                        }
                    }
                },
                testQuestions: true,
                explanation:true,
            }
    )
    .execute();
    const meta = await builder.countTotal();

    return {
        data:result,
        meta
    }
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