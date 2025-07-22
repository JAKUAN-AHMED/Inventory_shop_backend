import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StafService } from './staf.service';

const createStaf = catchAsync(async (req, res) => {
  const result = await StafService.createStaf(
    req.file as Express.Multer.File,
    req.body,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Created Staf' : 'Failed to Create Staf',
    Data: isOk ? result : [],
  });
});

const allStaf = catchAsync(async (req, res) => {
  const result = await StafService.allStaf(
    req.query,
    req.user.id as string
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Retriaved all Staf' : 'Failed to Retrived all Staf',
    Data: isOk ? result : [],
  });
});
const singleStaf = catchAsync(async (req, res) => {
  const result = await StafService.singleStaf(
    req.params.id as string
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Retriaved  Staf' : 'Failed to Retrived a Staf',
    Data: isOk ? result : [],
  });
});
const deleteStaf = catchAsync(async (req, res) => {
  const result = await StafService.deleteStaf(
    req.params.id as string
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Deleted  Staf' : 'Failed to Deltete a Staf',
    Data: isOk ? result : [],
  });
});

export const StafController = {
    createStaf,
    allStaf,
    singleStaf,
    deleteStaf
};
