import { Router } from "express";
import auth from "../../middlewares/auth";
import { AdminDashController } from "./admin.controller";

const router=Router();


//analytical data
router.get('/analytics',auth('ADMIN'),AdminDashController.anaylyticsData);
router.get('/recent-payments',auth('ADMIN'),AdminDashController.lastRecentPayment);


export const AdminDashRoutes=router;