import { Router } from "express";
import auth from "../../middlewares/auth";
import { PaymentController } from "./payment.controller";

const router=Router();
router.get('/all-payment',auth('ADMIN','STUDENT'),PaymentController.getAllPayments);
router.get('/single-payment/:id',auth('ADMIN','STUDENT'),PaymentController.singlePayment);
export const PaymentRoutes=router;