import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const getAllPayments = catchAsync(async (req, res) => {
    const result = await PaymentService.getAllPayments(req.user.id as string, req.user.role as string, req.query);
    const isOk = result.result.length>0? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 404,
        success: isOk,
        message: isOk ? 'Successfully Retrieved Latest  All User Payments' : 'Not Found Payments',
        Data: isOk ? result : [],
    });
})
const singlePayment = catchAsync(async (req, res) => {
    const result = await PaymentService.singlePayment(req.user.id as string,req.params.id, req.user.role as string);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 404,
        success: isOk,
        message: isOk ? 'Successfully Retrieved A User Payment' : 'Not Found Payments',
        Data: isOk ? result : [],
    });
})

export const PaymentController={
    getAllPayments,
    singlePayment
}