import { Router } from "express";
import auth from "../../middlewares/auth";
import { testQController } from "./testQ.controller";

const router=Router();

router.patch('/answer',auth('ADMIN','STUDENT'),testQController.AnswerTheTestQuestion);
router.get('/my-questions/:testId',auth('ADMIN','STUDENT'),testQController.MyQuestions);

export const testQRouter=router;