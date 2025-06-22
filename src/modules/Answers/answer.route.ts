import { Router } from "express";
import auth from "../../middlewares/auth";
import { AnswerController } from "./answer.controller";

const router = Router();

router.post('/create', auth('ADMIN', 'INSTRUCTOR'), AnswerController.createAnswer);
router.get('/all', auth('ADMIN', 'INSTRUCTOR', 'STUDENT'), AnswerController.getAllAnswers);
router.patch('/update/:id', auth('ADMIN', 'INSTRUCTOR'), AnswerController.updateAnswer);
router.get('/:id', auth('ADMIN', 'INSTRUCTOR', 'STUDENT'), AnswerController.singleAnswer);
router.delete('/delete/:id', auth('ADMIN', 'INSTRUCTOR'), AnswerController.deleteAnswer);


export const AnswerRoutes = router;