import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminDASHService } from "./admin.service";

const anaylyticsData = catchAsync(async (req, res) => {
    const result = await AdminDASHService.anaylyticsData();
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Retrieved Admin Analytics Data' : 'Failed to Retrieve Admin Analytics Data',
        Data: isOk ? result : [],
    });
})
const lastRecentPayment = catchAsync(async (req, res) => {
    const result = await AdminDASHService.lastRecentPayment();
    const isOk = result.length>0 ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Retrieved Last  Recent Payments Data' : 'Failed to Retrieve Last  Recent Payments Data',
        Data: isOk ? result : [],
    });
})

export const AdminDashController={
    anaylyticsData,
    lastRecentPayment
}