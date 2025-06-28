import { Router } from "express";
import auth from "../../middlewares/auth";
import { testRcontroller } from "./testR.controller";

const router=Router();


// router.post('/generate-result',auth('ADMIN','STUDENT'),testRcontroller.createTestResult);
router.get('/mytestResult',auth('ADMIN','STUDENT'),testRcontroller.getMyTestResult);
export const testResultRoute = router;