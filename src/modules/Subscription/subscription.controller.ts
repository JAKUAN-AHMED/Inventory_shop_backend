import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import Stripe from 'stripe';
import { SubscriptionService } from './subscription.service';

const createSubscriptionSession = catchAsync(async (req, res) => {
  const { user } = req;
  const { name: planName } = req.body;

  if (!planName) {
    throw new AppError(
      400,
      'Plan name is required to create a subscription session',
    );
  }

  if (!user || !user.id || !user.email) {
    throw new AppError(400, 'User information is missing or incomplete');
  }

  const RESPONSE = await SubscriptionService.createSubscriptionSession(
    user,
    planName,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription session created successfully',
    Data: RESPONSE,
  });
});

import { Request, Response } from 'express';

export const webhook = async (req: Request, res: Response) => {
  // Respond immediately to Stripe to avoid timeouts
  res.status(200).send();

  const event = req.body as Stripe.Event;

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await SubscriptionService.handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case 'customer.subscription.updated':
        await SubscriptionService.handleSubscriptionUpdated(event);
        break;

      case 'invoice.payment_succeeded':
        await SubscriptionService.handleInvoicePaymentSucceeded(
          event.data.object,
        );
        break;

      case 'customer.subscription.deleted':
        await SubscriptionService.deleteSubscription(event);
        break;

      case 'invoice.payment_failed':
        await SubscriptionService.handleInvoicePaymentFailed(event);
        break;

      case 'customer.subscription.trial_will_end':
        await SubscriptionService.handleSubscriptionWillEnd(event);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
  }
};

export const SubscriptionController = { createSubscriptionSession, webhook };
