import { Router } from "express";
import auth from "../../middlewares/auth";
import { LicenseController } from "./license.controller";

const router=Router();
//create license
router.post('/createLicense',auth('ADMIN'),LicenseController.createLicense);

//delete license
router.delete('/deleteLicense/:id',auth('ADMIN'),LicenseController.deleteLicense);

//get all license
router.get('/Licenses',auth('ADMIN','INSTRUCTOR','STUDENT'),LicenseController.getAllLicense);

//get single license
router.get('/License/:id',auth('ADMIN','INSTRUCTOR','STUDENT'),LicenseController.singleLicense);


//update license
router.patch('/License/:id',auth('ADMIN'),LicenseController.updateLicense);


export const LicenseRoutes=router;