import { Router } from "express";
import auth from "../../middlewares/auth";
import { testQController } from "./testQ.controller";

const router=Router();

router.patch('/answer/:id',auth('ADMIN','INSTRUCTOR','STUDENT'),testQController.updateTestQuestion);

export const testQRouter=router;