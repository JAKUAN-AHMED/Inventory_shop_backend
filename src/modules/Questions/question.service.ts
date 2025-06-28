import { Question } from "@prisma/client"
import { prisma } from "../../prisma/client"
import QueryBuilder from "../../builder/QueryBuilder"
import { isExplanation, isValidOptions, NotFound } from "../../utils/utility"
import AppError from "../../errors/AppError"
import { deleteFromDigitalOceanAWS, uploadToDigitalOceanAWS } from "../../utils/sendImageToCloudinary"

import { JsonValue } from "@prisma/client/runtime/library"
import { IQuestion } from "./question.interface"
import { deleteFile } from "../../helpers/FileDelete"


type optionsType = {
    label: "A" | "B" | "C" | "D",
    value: string
}

export type ExplanationType={
    text:string,
    img:string
}

const createQuestion = async (file:any,payload:IQuestion ) => {
    const { options,explanation, topicId, text, correctAnswer } = payload;

    if (!options || !explanation || !text || !correctAnswer || !topicId) {
        throw new AppError(404, 'A field is missing');
    }
  
    if (!Array.isArray(options) || options.length !== 4) {
        throw new AppError(400, "Options must be an array of exactly 4 items");
    }

    
   if (file) {
    //    const imageUrl = `${process.env.BACKEND_LIVE_URL}/uploads/${file.filename}`;
    const {location}=await uploadToDigitalOceanAWS(file);
       explanation.img=location;
   }
    return await prisma.question.create({
        data: {
            options,
            explanation: JSON.parse(JSON.stringify(explanation)),
            topicId,
            text,
            correctAnswer
        }
    })
}



const updateQuestion = async (file:Express.Multer.File,id: string, payload: Partial<IQuestion>) => {

    const { options, correctAnswer,text,explanation } = payload;

    const result=await prisma.question.findUnique({
        where:{
            id
        }
    })

    if(file)
    {
        let explanationObj: any = result?.explanation;
        if (typeof explanationObj === "string") {
            try {
                explanationObj = JSON.parse(explanationObj);
            } catch (e) {
                explanationObj = {};
            }
        }
        // const deletImg = await deleteFile(explanationObj?.img as string);
        await deleteFromDigitalOceanAWS(explanationObj?.img as string);
        //  const updated = `${process.env.BACKEND_LIVE_URL}/uploads/${file.filename}`;
        const {location}=await uploadToDigitalOceanAWS(file);
      
         if (explanation) {
            //  explanation.img = updated as string;
             explanation.img = location as string;
         }
    }
    

    return await prisma.question.update({
        where: { id },
        data: {
            options: options ? JSON.parse(JSON.stringify(options)) : undefined,
            correctAnswer,
            text,
            explanation: explanation ? JSON.parse(JSON.stringify(explanation)) : undefined

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


    if (
        isExistQuestions &&
        isExistQuestions.explanation
    ) {
        let explanationObj: any = isExistQuestions.explanation;
        if (typeof explanationObj === "string") {
            try {
                explanationObj = JSON.parse(explanationObj);
            } catch (e) {
                explanationObj = {};
            }
        }
        if (explanationObj?.img) {
            // You can now safely access explanationObj.img here
            // await deleteFile(explanationObj.img)

             await deleteFromDigitalOceanAWS(explanationObj?.img as string);
            
        }
    }

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