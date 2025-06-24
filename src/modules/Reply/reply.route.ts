import { Router } from "express";
import { ReplyController } from "./reply.controller";
import auth from "../../middlewares/auth";

const router=Router();
router.post('/add-reply',auth('ADMIN','STUDENT'),ReplyController.createReply);
router.patch('/update-reply/:id',auth('ADMIN','STUDENT'),ReplyController.updateReply);
router.delete('/delete-reply/:id',auth('ADMIN','STUDENT'),ReplyController.deleteReply);
export const ReplyRoutes=router;