import { Router } from "express";
import auth from "../../middlewares/auth";
import { testRcontroller } from "./testR.controller";

const router=Router();


router.post('/generate-result',auth('ADMIN','STUDENT'),testRcontroller.createTestResult);
router.get('/generate-results',auth('ADMIN','STUDENT'),testRcontroller.getTestResult);
export const testResultRoute = router;