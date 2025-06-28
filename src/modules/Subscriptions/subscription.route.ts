import { Router } from "express";
import auth from "../../middlewares/auth";
import { SubscriptionController } from "./subscription.controller";

const router=Router();

//create product
router.post('/create-plan',auth('ADMIN'), SubscriptionController.CreatePlan);
router.get('/all-plans',auth('ADMIN'), SubscriptionController.AllPlans);
router.get('/single-plan/:id',auth('ADMIN'), SubscriptionController.SinglePlan);
router.patch('/update-plan/:id', auth('ADMIN'),SubscriptionController.UpdatePlan);
router.post('/create-session',auth('ADMIN','STUDENT'),SubscriptionController.createSubscriptionSession);
router.delete('/delete-plan/:id',auth('ADMIN'),SubscriptionController.deletePlan);


export const SubscriptionRoutes=router;
