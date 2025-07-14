import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../middlewares/auth';

import { upload } from '../../utils/sendImageToCloudinary';
import validateRequest from '../../middlewares/validateRequest';
import { customerValidationSchema, updatecustomerValidationSchema } from './customer.validation';
import { customerController } from './customer.controller';




const router = Router();

//create  customer and send password to him
router.post(
  '/create-customer',
  auth('BUSINESS','STAF'),
  validateRequest(customerValidationSchema),
  customerController.createcustomer,
);

//all  customer
router.get('/all- customer',auth('BUSINESS','ADMIN','STAF'),customerController.allcustomers);
router.get('/single- customer/:id',auth('BUSINESS','ADMIN','USER','STAF'),customerController.singlecustomer);
router.delete('/delete- customer/:id',auth('BUSINESS','STAF'),customerController.deletecustomer);

//update customer
router.patch('/updated- customer/:id',auth('BUSINESS','STAF'),
upload.single('file'),
(req:Request,res:Response,next:NextFunction)=>{
  if(typeof req.body.data==='string'){
    req.body=JSON.parse(req.body.data)
  }
},
validateRequest(updatecustomerValidationSchema),
customerController.updatecustomer);
export const  customerRoutes = router;
