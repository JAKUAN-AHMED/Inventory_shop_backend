import { Router } from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { authValidation } from './auth.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

router.post(
  '/register',
  validateRequest(authValidation.UserRegisterValidationSchema),
  AuthController.register,
);



router.post(
  '/login',
  validateRequest(authValidation.UserLoginValidationSchema),
  AuthController.login,
);

router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password/:token', AuthController.resetPassword);

router.post(
  '/change-password',
  auth('ADMIN'),
  AuthController.changePassword,
);

router.post('/refresh-token', AuthController.refreshToken);
router.post('/make-admin', AuthController.makeAdmin);

export const AuthRoutes = router;
