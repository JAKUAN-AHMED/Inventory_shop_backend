import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../middlewares/auth';

import { upload } from '../../utils/sendImageToCloudinary';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './product.controller';


const router = Router();

//create  product and send password to him
router.post(
  '/create-product',
  auth('BUSINESS'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.body.data === 'string') {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  ProductController.createProduct,
);

//all  product
router.get('/all- product',auth('BUSINESS'),ProductController.allProducts);
router.get('/single- product/:id',auth('BUSINESS'),ProductController.singleProduct);
router.delete('/delete- product/:id',auth('BUSINESS'),ProductController.deleteProduct);
export const  productRoutes = router;
