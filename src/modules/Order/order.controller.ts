import { all } from 'axios';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderServices } from './order.service';

const createOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.createOrder(
    req.user.id as string,
    req.body,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Created Order' : 'Failed to Create Order',
    Data: isOk ? result : [],
  });
});
const updateOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.updateOrder(
    req.user.id as string,
    req.params.id  as string,
    req.body,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Updated a Order' : 'Failed to update a Order',
    Data: isOk ? result : [],
  });
});
const deleteOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.deleteOrder(
    req.user.id as string,
    req.params.id  as string,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully deleted a Order' : 'Failed to delete a Order',
    Data: isOk ? result : [],
  });
});
const allOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.allOrder(
    req.user.id as string,
    req.query
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully retrived  Orders' : 'Failed to retrieved  Order',
    Data: isOk ? result : [],
  });
});
const singleOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.singleOrder(
    req.user.id as string,
    req.params.id as string
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully retrived  a Orders' : 'Failed to retrieve a Order',
    Data: isOk ? result : [],
  });
});


export const OrderController={
    createOrder,
    deleteOrder,
    updateOrder,
    allOrder,
    singleOrder
}