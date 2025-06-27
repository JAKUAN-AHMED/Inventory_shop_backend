import { Router } from "express";
import auth from "../../middlewares/auth";
import { LsTypeController } from "./lstypes.controller";

const router=Router()
router.post('/addlstype',auth('ADMIN'),LsTypeController.addLsType);
router.get('/allLstype',auth('ADMIN'),LsTypeController.getAllLicenseTypes);
router.get('/lstype',auth('ADMIN'),LsTypeController.SingleLsType);
router.delete('/delete-lstype',auth('ADMIN'),LsTypeController.DeleteLsType);
router.patch('/update-lstype',auth('ADMIN'),LsTypeController.updateLsType);
export const LicenseTypesRouter=router;