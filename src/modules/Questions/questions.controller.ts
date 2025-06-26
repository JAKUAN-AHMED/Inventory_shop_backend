import AppError from "../../errors/AppError";
import { prisma } from "../../prisma/client";
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { QuestionService } from "./question.service"




const createQuestion = catchAsync(async (req, res) => {

    const isExists=await prisma.question.findUnique({
        where: {
            text: req.body.text 
        }
    });

    if (isExists) {
        throw new AppError(409,'Question with this name already exists');
    }

    const result = await QuestionService.createQuestion(req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 201 : 400,
        success: isOk,
        message: isOk ? 'Successfully Created Question' : 'Failed to create Question',
        Data: isOk ? result : [],
    });

})


const getAllQuestions = catchAsync(async (req, res) => {
    const result = await QuestionService.AllQuestions(req.query);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Retrieved All Questions' : 'Failed to Retrieve All Questions',
        Data: isOk ? result : [],
    });
})
const updateQuestion = catchAsync(async (req, res) => {
    const result = await QuestionService.updateQuestion(req.params.id, req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Updated Question' : 'Failed to Update Question',
        Data: isOk ? result : [],
    });
})


const singleQuestion = catchAsync(async (req, res) => {
    const result = await QuestionService.QuestionById(req.params.id);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Retrieved Question' : 'Failed to Retrieve Question Data',
        Data: isOk ? result : [],
    });
})

const deleteQuestion = catchAsync(async (req, res) => {
    const result = await QuestionService.deleteQuestion(req.params.id);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Deleted Question' : 'Failed to Delete Question Data',
        Data: isOk ? result : [],
    });
})





export const QuestionController = {
    createQuestion,
    getAllQuestions,
    updateQuestion,
    singleQuestion,
    deleteQuestion
}