import express from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { UserRoutes } from '../modules/User/user.routes';
import { ContactRoutes } from '../modules/Contact/contact.routes';
import { BookingRoutes } from '../modules/Bookings/booking.routes';
import { SubscriptionRoutes } from '../modules/Subscription/subscription.routes';
import { PaymentRoutes } from '../modules/Payment/payment.route';
import servicePlanRoutes from '../modules/servicePlan/servicePlan.routes';
import simpleReportRoutes from '../modules/simpleReport/simpleReport.route';
import { TestimonialRoutes } from '../modules/testimonial/testimonial.route';


const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',  
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/contact',
    route: ContactRoutes,
  },
  {
    path: '/bookings',
    route: BookingRoutes,
  },
  {
    path: '/subscription',
    route: SubscriptionRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
  {
    path: "/serviceplan",
    route: servicePlanRoutes,
  },
  {
    path: "/simplereport",
    route: simpleReportRoutes
  },
  {
    path: "/testimonial",
    route: TestimonialRoutes
  }

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));


export default router;
