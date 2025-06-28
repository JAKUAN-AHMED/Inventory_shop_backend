import AppError from "../../errors/AppError";
import { prisma } from "../../prisma/client";
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { testQService } from "./testQ.service";



const AnswerTheTestQuestion = catchAsync(async (req, res) => {
    const isExists = await prisma.testQuestion.findFirst({
        where: {
            id: req.params.id
        }
    });
    if (!isExists) {
        throw new AppError(404, 'Test Question not found');
    }
    const result = await testQService.AnswerTheTestQuestion(req.user.id as string,req.params.id, req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Answered a Question' : 'Failed to Answered a Question',
        Data: isOk ? result : [],
    });
})
export const testQController = {
AnswerTheTestQuestion}