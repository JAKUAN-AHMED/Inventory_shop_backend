import { Router } from "express";
import auth from "../../middlewares/auth";
import { AdminDashController } from "./admin.controller";

const router=Router();


//analytical data
router.get('/analytics',auth('ADMIN'),AdminDashController.anaylyticsData);
router.get('/recent-payments',auth('ADMIN'),AdminDashController.lastRecentPayment);
router.get('/users-testresult',auth('ADMIN'),AdminDashController.EveryUserTestResult);


export const AdminDashRoutes=router;