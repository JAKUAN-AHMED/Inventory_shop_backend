import { Router } from "express";
import auth from "../../middlewares/auth";

const router=Router();
//create license
router.post('/createLicense',auth('ADMIN'));


export const LicenseRoutes=router;