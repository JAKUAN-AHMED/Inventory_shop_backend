import { Router } from "express";
import auth from "../../middlewares/auth";
import { SubscriptionController } from "./subscription.controller";

const router=Router();

//create product
router.post('/create-product',auth('ADMIN'), SubscriptionController.createProduct);
router.get('/all-plans',auth('ADMIN','STUDENT'), SubscriptionController.allProducts);
router.patch('/update-product/:id', SubscriptionController.updateProduct);
router.post('/create-session',auth('ADMIN','STUDENT'),SubscriptionController.createSession);
router.delete('/delete-product/:id',auth('ADMIN'),SubscriptionController.deleteProduct);


export const SubscriptionRoutes=router;
