import { prisma } from '../../prisma/client';
import catchAsync from '../../utils/catchAsync';
import { uploadToDigitalOceanAWS } from '../../utils/sendImageToCloudinary';
import sendResponse from '../../utils/sendResponse';
import { customerService } from './customer.service';

const createcustomer = catchAsync(async (req, res) => {
  const userId = req.user.id as string;
  req.body.userId = userId;

  const user = await prisma.staf.findUnique({
    where: {
      id: userId,
    },
  });

  const shopId = user?.shopId as string;
  req.body.shopId = shopId as string;
  const result = await customerService.createCustomer(req.body);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Created customer '
      : 'Failed to Create customer',
    Data: isOk ? result : [],
  });
});

const allcustomers = catchAsync(async (req, res) => {
  const result = await customerService.allCustomers(
    req.query,
    req.user.id as string,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Retriaved all customer'
      : 'Failed to Retrived all customer',
    Data: isOk ? result : [],
  });
});
const singlecustomer = catchAsync(async (req, res) => {
  const result = await customerService.singlecustomer(req.params.id as string);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Retriaved  customer'
      : 'Failed to Retrived a customer',
    Data: isOk ? result : [],
  });
});
const deletecustomer = catchAsync(async (req, res) => {
  const result = await customerService.deletecustomer(req.params.id as string);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Deleted  customer'
      : 'Failed to Deltete a customer',
    Data: isOk ? result : [],
  });
});

const updatecustomer = catchAsync(async (req, res) => {
  const file = req.file as Express.Multer.File;

  if (file) {
    const { location } = await uploadToDigitalOceanAWS(file);
    req.body.img = location as string;
  }
  req.body.userId = req.user.id;
  req.body.email = req.user.email;

  const result = await customerService.updatecustomer(
    req.params.id as string,
    req.body,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk
      ? 'Successfully Updated customer'
      : 'Failed to update a customer',
    Data: isOk ? result : [],
  });
});

export const customerController = {
  createcustomer,
  allcustomers,
  singlecustomer,
  deletecustomer,
  updatecustomer,
};
