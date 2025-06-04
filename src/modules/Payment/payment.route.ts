import { Router } from 'express';
import auth from '../../middlewares/auth';
import { PaymentController } from './payment.controller';
const router = Router();
router.get('/', auth('ADMIN'), PaymentController.getAllPayments);
router.get(
  '/user',
  auth('ADMIN', 'BUSINESS'),
  PaymentController.getUserPayments,
);

export const PaymentRoutes = router;
