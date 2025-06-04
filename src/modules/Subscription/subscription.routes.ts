import { Router } from 'express';
import auth from '../../middlewares/auth';
import { SubscriptionController } from './subscription.controller';
const router = Router();
router.post(
  '/stripe-checkout-session',
  auth('BUSINESS'),
  SubscriptionController.createSubscriptionSession,
);

router.post('/webhook', SubscriptionController.webhook);

export const SubscriptionRoutes = router;

