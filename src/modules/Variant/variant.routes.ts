import { Router } from "express";
import auth from "../../middlewares/auth";
import { VariantController } from "./variant.controller";

const router=Router();

//create
router.post('/create',auth('STAF','BUSINESS'),VariantController.createVariant);

//update
router.patch('/update/:id',auth('STAF','BUSINESS'),VariantController.updatevariant);

//delete
router.delete('/delete/:id',auth('STAF','BUSINESS'),VariantController.deleteVariant);

//all variant
router.get('/all-variant',auth('STAF','BUSINESS'),VariantController.allVariant);

//single variant
router.get('/single-variant/:id',auth('STAF','BUSINESS'),VariantController.singleVariant);


export const VariantRoutes=router;