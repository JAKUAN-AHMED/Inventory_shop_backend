import { Router } from "express";
import auth from "../../middlewares/auth";
import { VoteController } from "./vote.controller";

const router=Router();
router.post('/upVote',auth('ADMIN','STUDENT'),VoteController.giveUpVote);
router.post('/downVote',auth('ADMIN','STUDENT'),VoteController.giveDownVote);
export const VoteRoutes=router;