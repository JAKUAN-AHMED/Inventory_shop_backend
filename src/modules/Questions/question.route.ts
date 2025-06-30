import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import { QuestionController } from "./questions.controller";

import validateRequest from "../../middlewares/validateRequest";
import { questionSchema, questionUpdateSchema } from "./question.validation";
import { upload } from "../../utils/sendImageToCloudinary";

const router = Router();

router.post('/create',
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        if (typeof req.body.data === 'string') {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    auth('ADMIN', 'INSTRUCTOR'), validateRequest(questionSchema), QuestionController.createQuestion);
router.get('/all', auth('ADMIN', 'INSTRUCTOR', 'STUDENT'), QuestionController.getAllQuestions);
router.patch('/update/:id',
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        if (typeof req.body.data === 'string') {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    auth('ADMIN', 'INSTRUCTOR'),
    validateRequest(questionUpdateSchema),
    QuestionController.updateQuestion);
router.get('/:id', auth('ADMIN', 'INSTRUCTOR', 'STUDENT'), QuestionController.singleQuestion);
router.delete('/delete/:id', auth('ADMIN', 'INSTRUCTOR'), QuestionController.deleteQuestion);


//upload excel file

router.post('/upload-excelFile',auth("ADMIN"),
upload.single('file'),
QuestionController.uploadQuestionsWithExcelFile)

export const questionRouter = router;