import express from 'express';
import { UserRoutes } from '../modules/User/user.routes';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { ShopRoutes } from '../modules/Shop/shop.routes';
import { StafRoutes } from '../modules/Staf/staf.route';
import { productRoutes } from '../modules/Products/product.route';

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
    path: '/shop',
    route: ShopRoutes,
  },
  {
    path: '/staf',
    route: StafRoutes,
  },
  {
    path: '/product',
    route: productRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
