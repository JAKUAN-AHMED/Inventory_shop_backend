import { Router } from "express";
import auth from "../../middlewares/auth";
import { SubscriptionController } from "./subscription.controller";

const router=Router();

//create product
router.post('/create-plan',auth('ADMIN'), SubscriptionController.CreatePlan);
router.get('/all-plans',auth('ADMIN','STUDENT'), SubscriptionController.AllPlans);
router.get('/single-plan/:id',auth('ADMIN','STUDENT'), SubscriptionController.SinglePlan);
router.patch('/update-plan/:id', SubscriptionController.UpdatePlan);
// router.post('/create-session',auth('ADMIN','STUDENT'),SubscriptionController.createSession);
router.delete('/delete-plan/:id',auth('ADMIN'),SubscriptionController.deletePlan);


export const SubscriptionRoutes=router;
