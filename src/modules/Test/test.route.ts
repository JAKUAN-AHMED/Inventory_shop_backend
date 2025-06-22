import { Router } from "express";
import auth from "../../middlewares/auth";
import { TestController } from "./test.controller";

const router=Router();
router.post('/create',auth('ADMIN','INSTRUCTOR'),TestController.createTest);
router.get('/all', auth('ADMIN','INSTRUCTOR','STUDENT'), TestController.getAllTests);
router.patch('/update/:id', auth('ADMIN','INSTRUCTOR'), TestController.updateTest);
router.get('/:id', auth('ADMIN','INSTRUCTOR','STUDENT'), TestController.singleTest);
router.delete('/delete/:id', auth('ADMIN','INSTRUCTOR'), TestController.deleteTest);



export const TestRoutes = router;