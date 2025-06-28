import { Router } from "express";
import auth from "../../middlewares/auth";
import { TestController } from "./test.controller";

const router=Router();
router.post('/create',auth('ADMIN'),TestController.createTest);
router.get('/all', auth('ADMIN'), TestController.getAllTests);
router.get('/all', auth('ADMIN','STUDENT'), TestController.testByUserId);
// router.patch('/update/:id', auth('ADMIN'), TestController.updateTest);
router.get('/:id', auth('ADMIN','STUDENT'), TestController.singleTest);
router.delete('/delete/:id', auth('ADMIN','STUDENT'), TestController.deleteTest);



export const TestRoutes = router;