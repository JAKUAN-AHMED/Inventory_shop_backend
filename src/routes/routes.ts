import express from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { UserRoutes } from '../modules/User/user.routes';
import { ContactRoutes } from '../modules/Contact/contact.routes';
import servicePlanRoutes from '../modules/servicePlan/servicePlan.routes';
import simpleReportRoutes from '../modules/simpleReport/simpleReport.route';
import { TestimonialRoutes } from '../modules/testimonial/testimonial.route';
import { BookingRoutes } from '../modules/Booking/booking.routes';


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
  },
  {
    path: "/booking",
    route: BookingRoutes
  }

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));


export default router;
