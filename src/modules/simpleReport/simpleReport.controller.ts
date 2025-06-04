import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { simpleReportService } from "./simpleReport.service";

const createSimpleResport = catchAsync(async (req, res) => {
    const result = await simpleReportService.createSimpeReport(req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk ? true : false,
        message: isOk ? "Simple Report created successfully" : "Failed to create Simple Report",
        Data: isOk ? result : [],
    });
});


const getSimpleReportById = catchAsync(async (req, res) => {
    const result = await simpleReportService.getSimpleReportById(req.params.id);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk ? true : false,
        message: isOk ? "Simple Report retrieved successfully" : "Failed to retrieve Simple Report",
        Data: isOk ? result : [],
    }); 
});



export const SimpleReportController = {
    createSimpleResport,
    getSimpleReportById
};

