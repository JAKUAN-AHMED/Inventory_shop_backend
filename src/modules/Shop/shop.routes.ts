import { Router } from 'express';
import { ShopController } from './shop.controller';

const router = Router();

router.post('/shop', ShopController.shopFromDb);

export const ShopRoutes = router;
