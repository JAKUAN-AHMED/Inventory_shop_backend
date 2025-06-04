import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentServiece } from './payment.service';

const getAllPayments = catchAsync(async (req, res) => {
  const result = await PaymentServiece.getAllPayments(req.query);
  const isOk = result ? true : false;
  res.status(isOk ? 200 : 404).json({
    status: isOk ? 'success' : 'fail',
    data: isOk ? result : null,
    message: isOk ? 'Payments retrieved successfully' : 'No payments found',
  });
});

const getUserPayments = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await PaymentServiece.getUserPayments(userId);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk ? true : false,
    message: isOk ? 'Payments retrieved successfully' : 'No payments found',
    Data: isOk ? result : [],
  });
});

export const PaymentController = { getAllPayments, getUserPayments };
