import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const shopFromDb = catchAsync(async (req, res) => {
  const file = req.file as Express.Multer.File;

  const result = await AuthServices.register(file, req.body);
  const isok = result ? true : false;
  sendResponse(res, {
    statusCode: isok ? 201 : 400,
    success: isok,
    message: isok
      ? 'Registration Successfull please verify your email!'
      : 'Registration Failed',
    Data: isok ? result : [],
  });
});

export const ShopController = {
  register,
};
