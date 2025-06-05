import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { authValidation } from './auth.validation';

const register = catchAsync(async (req, res) => {
  const result = await AuthServices.register(req.body);
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



const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const result = await AuthServices.login({ email, password });
  const isok = result ? true : false;

  sendResponse(res, {
    statusCode: isok ? 200 : 400,
    success: isok,
    message: isok ? 'Login Successfull' : 'Login Failed',
    Data: isok ? result : [],
  });
});


const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
   await AuthServices.forgotPassword(email);
   sendResponse(res, {
    statusCode:200 ,
    success: true,
    message: "Check email",
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.params.token;
  const { email, newPassword } = req.body;

  const result = await AuthServices.resetPassword(email, token, newPassword);
  const isok = result ? true : false;

  sendResponse(res, {
    statusCode: isok ? 200 : 400,
    success: isok,
    message: isok ? 'Password Reset Successfull' : 'Password Reset Failed',
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { email } = (req as any).user;

  const { oldPassword, newPassword } =
    authValidation.changePasswordValidationSchema.parse(req.body);

  console.log(email, oldPassword, newPassword);

  const result = await AuthServices.changePassword(
    email,
    oldPassword,
    newPassword,
  );
  const isok = result ? true : false;
  sendResponse(res, {
    statusCode: isok ? 200 : 400,
    success: isok,
    message: isok ? 'Password Changed Successfull' : 'Password Change Failed',
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await AuthServices.refreshToken(refreshToken);
  const isok = result ? true : false;
  sendResponse(res, {
    statusCode: isok ? 200 : 400,
    success: isok,
    message: isok ? 'Refresh Token Successfull' : 'Refresh Token Failed',
    Data: isok ? result : [],
  });
});


const makeAdmin = catchAsync(async (req, res) => {
  const { name, email, password, zipcode, state, phone } = req.body;
  if (!email || !name || !password || !zipcode || !state || !phone) {
    throw new AppError(400, 'All fields is required! Please try again');
  }
  const result = await AuthServices.makeAdmin(req.body);
  const isok = result ? true : false;
  sendResponse(res, {
    statusCode: isok ? 200 : 400,
    success: isok,
    message: isok ? 'Admin Created Successfully!' : 'Admin Creation Failed',

    Data: isok ? result : [],
  });
});

export const AuthController = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
  makeAdmin,
};
