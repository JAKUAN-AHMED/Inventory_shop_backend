import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryService } from './category.service';


const createCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.createCategory(req.body);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Created Category' : 'Failed to Create Category',
    Data: isOk ? result : [],
  });
});
const updateCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.updateCategory(req.params.id as string,req.body);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Updated Category' : 'Failed to Update Category',
    Data: isOk ? result : [],
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.deleteCategory(req.params.id as string);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Deleted Category' : 'Failed to Deleted Category',
    Data: isOk ? result : [],
  });
});
const singleCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.singleCategory(req.params.id as string);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Retrieved a  Category' : 'Failed to Retrieve a  Category',
    Data: isOk ? result : [],
  });
});
const allCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.allCategory(req.query);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Retrieved Category' : 'Failed to Retrieved Category',
    Data: isOk ? result : [],
  });
});



export const CategoryController={
    createCategory,
    updateCategory,
    deleteCategory,
    allCategory,
    singleCategory
}
