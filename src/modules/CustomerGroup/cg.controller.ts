import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { customerGroupServices } from './cg.service';

const createCg = catchAsync(async (req, res) => {
  const result = await customerGroupServices.creatCg(
    req.user.id as string,
    req.body,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Created Customer Group' : 'Failed to Create Customer Group',
    Data: isOk ? result : [],
  });
});
const updateCg = catchAsync(async (req, res) => {
  const result = await customerGroupServices.updateCg(
    req.user.id as string,
    req.params.id as string,
    req.body,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk ? 'Successfully Updated Customer Group' : 'Failed to Updated Customer Group',
    Data: isOk ? result : [],
  });
});
const getAllMyCGroups = catchAsync(async (req, res) => {
  const result = await customerGroupServices.getAllMyCGroups(
    req.user.id as string,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk ? 'Successfully Retrived all Customer Group' : 'Failed to retrived  Customer Groups',
    Data: isOk ? result : [],
  });
});
const singleCGroup = catchAsync(async (req, res) => {
  const result = await customerGroupServices.singleCGroup(
    req.user.id as string,
    req.params.id as string,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk ? 'Successfully Retrived a Customer Group' : 'Failed to retrived  Customer Group',
    Data: isOk ? result : [],
  });
});
const deleteCGroup = catchAsync(async (req, res) => {
  const result = await customerGroupServices.deleteCGroup(
    req.user.id as string,
    req.params.id as string,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk ? 'Successfully Deleted a Customer Group' : 'Failed to Delete  Customer Group',
    Data: isOk ? result : [],
  });
});

export const CustomerGroupController={
    createCg,
    updateCg,
    deleteCGroup,
    getAllMyCGroups,
    singleCGroup
}