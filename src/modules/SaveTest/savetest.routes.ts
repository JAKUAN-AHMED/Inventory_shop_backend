import { Router } from "express";
import auth from "../../middlewares/auth";
import { SaveTestController } from "./savetest.controller";

const router=Router();
router.post('/save-test',auth('ADMIN','STUDENT'),SaveTestController.SaveTest);
router.get('/my-save-test',auth('ADMIN','STUDENT'),SaveTestController.MySaveTest);
router.get('/save-test/:id',auth('ADMIN','STUDENT'),SaveTestController.mySingleSaveTest);
router.delete('/delete-save-test/:id',auth('ADMIN','STUDENT'),SaveTestController.DeletemySingleSaveTest);
export const SaveRoutes=router;