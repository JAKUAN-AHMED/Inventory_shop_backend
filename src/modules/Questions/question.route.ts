import { Router } from "express";
import auth from "../../middlewares/auth";
import { QuestionController } from "./questions.controller";
import { upload } from "../../utils/sendImageToCloudinary";

const router=Router();

router.post('/create',
upload.single('file'),auth('ADMIN','INSTRUCTOR'),QuestionController.createQuestion);
router.get('/all', auth('ADMIN','INSTRUCTOR','STUDENT'), QuestionController.getAllQuestions);
router.patch('/update/:id', auth('ADMIN','INSTRUCTOR'), QuestionController.updateQuestion);
router.get('/:id', auth('ADMIN','INSTRUCTOR','STUDENT'), QuestionController.singleQuestion);
router.delete('/delete/:id', auth('ADMIN','INSTRUCTOR'), QuestionController.deleteQuestion);


export const questionRouter = router;