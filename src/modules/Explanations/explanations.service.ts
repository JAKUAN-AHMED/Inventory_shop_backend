import { Explanation, ExplanationRating } from "@prisma/client"
import { prisma } from "../../prisma/client";

const addExplanation = async(payload:Explanation) => {
    const {questionId,userId,text}=payload;
    return await prisma.explanation.create({
        data: {
            questionId: questionId,
            userId: userId,
            text: text
        }
    })
}

const updateExplanation = async(id:string,payload:Partial<Explanation>) => {
    const {text}=payload;
    return await prisma.explanation.update({
        where: {
            id
        },
        data: {
            text: text
        }
    })
}

const ratingExplanation=async(payload:ExplanationRating)=>{
    const {explanationId,userId,rating}=payload;
    return await prisma.explanationRating.create({
        data: {
            explanationId: explanationId,
            userId: userId,
            rating: rating
        }
    })
}

const deleteExplanation = async(id:string) => {
    return await prisma.explanation.delete({
        where: {
            id
        }
    })
}
export const explanationsService = {addExplanation,ratingExplanation,updateExplanation,deleteExplanation}