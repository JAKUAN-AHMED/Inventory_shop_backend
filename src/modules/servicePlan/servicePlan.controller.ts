import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { servicePlanService } from "./serviceplan.service";

const insertServicePlan = catchAsync(async (req, res) => {  
    const result = await servicePlanService.createServicePlan(req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk ? true : false,
        message: isOk ? "Service Plan created successfully" : "Failed to create Service Plan",
        Data: isOk ? result : [],
    });
});



const getAllServicePlan = catchAsync(async (req, res) => {
    const result = await servicePlanService.getAllServicePlan(req.query);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk ? true : false,
        message: isOk ? "Service Plan retrieved successfully" : "Failed to retrieve Service Plan",
        Data: isOk ? result : [],
    });
});


const getSingleServicePlan = catchAsync(async (req, res) => {
    const result = await servicePlanService.getSingleServicePlan(req.params.id);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk ? true : false,
        message: isOk ? "Service Plan retrieved successfully" : "Failed to retrieve Service Plan",
        Data: isOk ? result : [],
    });
});


export const servicePlanController = {
    insertServicePlan,
    getAllServicePlan,
    getSingleServicePlan
};