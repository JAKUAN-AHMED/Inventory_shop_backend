import { Router } from "express";
import auth from "../../middlewares/auth";
import { LicenseController } from "./license.controller";

const router=Router();
//create license
router.post('/createLicense',auth('ADMIN'),LicenseController.createLicense);
router.delete('/deleteLicense/:id',auth('ADMIN'),LicenseController.deleteLicense);
router.get('/Licenses',auth('ADMIN','INSTRUCTOR','STUDENT'),LicenseController.getAllLicense);
router.get('/License/:id',auth('ADMIN','INSTRUCTOR','STUDENT'),LicenseController.singleLicense);


export const LicenseRoutes=router;