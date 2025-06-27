import { SelectedOption } from "@prisma/client";
import AppError from "../../errors/AppError";
import { prisma } from "../../prisma/client";
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { AnswerService } from "./answer.service";


const createAnswer = catchAsync(async (req, res) => {


    const isExists = await prisma.answer.findFirst({
        where: {
            SelectedOption: req.body.SelectedOption,
            questionId: req.body.questionId
        }
    });

    if (isExists) {
        throw new AppError(409,'Answer with this text already exists for this question');
    }


    const question=await prisma.question.findUnique({
        where:{
            id:req.body.questionId
        }
    })

    if(question?.correctAnswer===req.body.SelectedOption)
    {
           //update score of the user test result
    }


    // const subscriptions=await prisma.subscription.findUnique({
    //     where:{
    //         userId:req.user.id
    //     }
    // })
    const result = await AnswerService.createAnswer(req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 201 : 400,
        success: isOk,
        message: isOk ? 'Successfully Created Answer' : 'Failed to Create Answer',
        Data: isOk ? result : [],
    });
})


const getAllAnswers = catchAsync(async (req, res) => {
    const result = await AnswerService.AllAnswers();
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Retrieved All Answers' : 'Failed to Retrieve All Answers',
        Data: isOk ? result : [],
    });
})

const updateAnswer = catchAsync(async (req, res) => {
    const result = await AnswerService.updateAnswer(req.params.id, req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Updated Answer' : 'Failed to Update Answer',
        Data: isOk ? result : [],
    });
})

const singleAnswer = catchAsync(async (req, res) => {
    const result = await AnswerService.AnswerById(req.params.id);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Retrieved Answer' : 'Failed to Retrieve Answer',
        Data: isOk ? result : [],
    });
})

const deleteAnswer = catchAsync(async (req, res) => {
    const result = await AnswerService.deleteAnswer(req.params.id);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Deleted Answer' : 'Failed to Delete Answer',
        Data: isOk ? result : [],
    });
})



export const AnswerController = {
    createAnswer,
    getAllAnswers,
    updateAnswer,
    singleAnswer,
    deleteAnswer

}