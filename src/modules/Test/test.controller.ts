import AppError from "../../errors/AppError";
import { prisma } from "../../prisma/client";
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { NotFound } from "../../utils/utility";
import { TestService } from "./test.service"

const createTest = catchAsync(async (req, res) => {

    const userId = req.user.id;
    await NotFound(userId, 'User');

    req.body.userId = userId;

    const isExists = await prisma.test.findFirst({
        where: {
            userId,
            licenseId:req.body.licenseId,
            topicId:req.body.topicId
        }
    });
    if (isExists) {
        throw new AppError(409, 'You already have a test created. Please update it instead of creating a new one.');
    }

    const result = await TestService.createTest(req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 201 : 400,
        success: isOk,
        message: isOk ? 'Successfully Created Test' : 'Failed to Create Test',
        Data: isOk ? result : [],
    });
})

const getAllTests = catchAsync(async (req, res) => {
    const result = await TestService.AllTests();
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Retrieved All Tests' : 'Failed to Retrieve All Tests',
        Data: isOk ? result : [],
    });
})


const testByUserId=catchAsync(async(req,res)=>{
    const result=await TestService.testByUserId(req.params.id);
    const isOk=result?true:false;
    sendResponse(res,{
        statusCode:isOk?200:400,
        success:isOk,
        message:isOk?  "Successfully Retrived all my test" : "Failed to retrived my test",
        Data:isOk ? result : []
    })
})

const updateTest = catchAsync(async (req, res) => {
    const result = await TestService.updateTest(req.params.id, req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Updated Test' : 'Failed to Update Test',
        Data: isOk ? result : [],
    });
})

const singleTest = catchAsync(async (req, res) => {
    const result = await TestService.TestById(req.params.id,req.user.id  as string,req.user.role);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Retrieved Test' : 'Failed to Retrieve Test',
        Data: isOk ? result : [],
    });
})

const deleteTest = catchAsync(async (req, res) => {
    const result = await TestService.deleteTest(req.params.id,req.user.id as string);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Deleted Test' : 'Failed to Delete Test',
        Data: isOk ? result : [],
    });
})


export const TestController = {

    createTest,
    getAllTests,
    updateTest,
    singleTest,
    deleteTest,
    testByUserId
}