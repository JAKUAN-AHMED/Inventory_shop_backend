import express from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { UserRoutes } from '../modules/User/user.routes';
import {  SubscriptionRoutes } from '../modules/Subscriptions/subscription.route';

import { PaymentRoutes } from '../modules/Payment/payment.routes';


const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  }
  ,{
    path:"/subscription",
    route:SubscriptionRoutes
  },
  {
    path:'/payment',
    route:PaymentRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));


export default router;
