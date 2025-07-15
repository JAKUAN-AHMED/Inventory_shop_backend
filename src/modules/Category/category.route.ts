import { Router } from "express";
import auth from "../../middlewares/auth";
import { CategoryController } from "./category.controller";


const router=Router();

//create
router.post('/create',auth('STAF','ADMIN'),CategoryController.createCategory);

//update
router.patch('/update/:id',auth('STAF','ADMIN'),CategoryController.updateCategory);

//delete
router.delete('/delete/:id',auth('STAF','ADMIN'),CategoryController.deleteCategory);

//all Category
router.get('/all-Category',auth('STAF','ADMIN'),CategoryController.allCategory);

//single Category
router.get('/single-Category/:id',auth('STAF','ADMIN'),CategoryController.singleCategory);


export const CategoryRoutes=router;