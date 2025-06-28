import { Router } from "express";
import auth from "../../middlewares/auth";
import { AnswerController } from "./answer.controller";

const router = Router();

router.post('/create', auth('ADMIN', 'STUDENT'), AnswerController.createAnswer);
router.get('/all', auth('ADMIN', 'STUDENT'), AnswerController.getAllAnswers);

//should not give permission for update answer
router.patch('/update/:id', auth('ADMIN', 'STUDENT'), AnswerController.updateAnswer);
router.get('/:id', auth('ADMIN','STUDENT'), AnswerController.singleAnswer);
router.delete('/delete/:id', auth('ADMIN', 'STUDENT'), AnswerController.deleteAnswer);


export const AnswerRoutes = router;