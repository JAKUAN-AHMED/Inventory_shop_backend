import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { createShopValidation, updateValidationSchema } from './shop.validation';
import { ShopController } from './shop.controller';
import { upload } from '../../utils/sendImageToCloudinary';


const router = Router();

//creat shop

router.post('/create-shop',auth('USER'),
upload.single('file'),
validateRequest(createShopValidation),ShopController.createShop);

router.patch('/update-shop/:id',auth('BUSINESS'),
upload.single('file'),
validateRequest(updateValidationSchema),ShopController.updateShop);

router.get('/all-shop',auth('ADMIN'),ShopController.getAllShop);
router.get('/my-shop',auth('BUSINESS','STAF','ADMIN'),ShopController.getMyShop);


router.get('/single-shop/:id',auth('BUSINESS','STAF','ADMIN'),ShopController.singleShop);

router.get('/delete-shop/:id',auth('ADMIN'),ShopController.deleteShop);


export const ShopRoutes = router;
