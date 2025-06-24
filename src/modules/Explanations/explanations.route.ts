import { Router } from "express";
import auth from "../../middlewares/auth";
import { explanationsController } from "./explanations.controller";

const router=Router();

router.post('/add-explanation',auth('ADMIN','STUDENT'),explanationsController.addExplanation);
router.patch('/update-explanation/:id',auth('ADMIN','STUDENT'),explanationsController.updateExplanation);
router.post('/rating-explanation',auth('ADMIN','STUDENT'),explanationsController.ratingExplanation);
router.delete('/delete-explanation/:id',auth('ADMIN','STUDENT'),explanationsController.deleteExplanation);

export const explanationsRouter = router;