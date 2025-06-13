import express from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { UserRoutes } from '../modules/User/user.routes';
import { ContactRoutes } from '../modules/Contact/contact.routes';


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
 

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));


export default router;
