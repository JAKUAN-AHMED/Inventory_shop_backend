import { Router } from "express";
import auth from "../../middlewares/auth";
import { PayementController } from "./payment.controller";

const router=Router();

//create product
router.post('/create-product',auth('ADMIN'), PayementController.createProduct);
router.patch('/update-product/:id', PayementController.updateProduct);
router.post('/create-session',auth('ADMIN'),PayementController.createSession);
router.delete('/delete-product/:id',auth('ADMIN'),PayementController.deleteProduct);


export const PayementRoutes=router;
