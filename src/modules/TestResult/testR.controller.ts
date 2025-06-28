import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { NotFound } from "../../utils/utility";
import { TestResultService } from "./testR.service"

// const createTestResult = catchAsync(async (req, res) => {
//     req.body.userId=req.user.id;
//     const result = await TestResultService.createTestResult(req.body)
//     const isOk = result ? true : false;
//     sendResponse(res, {
//         statusCode: isOk ? 200 : 400,
//         success: isOk,
//         message: isOk ? 'Successfully add User Result' : 'Failed toadd User Result',
//         Data: isOk ? result : [],
//     });
// })


const getMyTestResult = catchAsync(async (req, res) => {
    // const { id } = req.params;
    const userId = req?.user?.id;
    await NotFound(userId, 'User');

    const result = await TestResultService.getMyTestResult(userId as string)
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully got My Result' : 'Failed to get MY Result',
        Data: isOk ? result : [],
    });
})
export const testRcontroller = { 
    // createTestResult,
     getMyTestResult 
}