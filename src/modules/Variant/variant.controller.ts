import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VariantService } from './variant.service';

const createVariant = catchAsync(async (req, res) => {
  const result = await VariantService.createVariant(req.body);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Created Variant' : 'Failed to Create Variant',
    Data: isOk ? result : [],
  });
});
const updatevariant = catchAsync(async (req, res) => {
  const result = await VariantService.updateVariant(req.params.id as string,req.body);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Updated Variant' : 'Failed to Update Variant',
    Data: isOk ? result : [],
  });
});

const deleteVariant = catchAsync(async (req, res) => {
  const result = await VariantService.deleteVariant(req.params.id as string);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Deleted Variant' : 'Failed to Deleted Variant',
    Data: isOk ? result : [],
  });
});
const singleVariant = catchAsync(async (req, res) => {
  const result = await VariantService.singleVariant(req.params.id as string);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Retrieved a  Variant' : 'Failed to Retrieve a  Variant',
    Data: isOk ? result : [],
  });
});
const allVariant = catchAsync(async (req, res) => {
  const result = await VariantService.allVariant(req.query);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Retrieved Variant' : 'Failed to Retrieved Variant',
    Data: isOk ? result : [],
  });
});



export const VariantController={
    createVariant,
    updatevariant,
    deleteVariant,
    allVariant,
    singleVariant
}
