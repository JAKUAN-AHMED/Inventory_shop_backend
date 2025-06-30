import { Router } from "express";
import auth from "../../middlewares/auth";
import { CommentController } from "./comment.controller";

const router=Router();
router.post('/add-comment',auth('ADMIN','STUDENT'),CommentController.createCommnent);
router.patch('/update-comment/:id',auth('ADMIN','STUDENT'),CommentController.updateComment);
router.delete('/delete-comment/:id',auth('ADMIN','STUDENT'),CommentController.deleteComment);
router.post('/downvote-comment',auth('ADMIN','STUDENT'),CommentController.downVoteToComment);
router.post('/upvote-comment',auth('ADMIN','STUDENT'),CommentController.upVoteToComment);   
router.get('/get-comment/:id',auth('ADMIN','STUDENT'),CommentController.getComment);
router.get('/get-comments',auth('ADMIN','STUDENT'),CommentController.getComments);
// router.delete('/remove-downvote-comment/:id',auth('ADMIN','STUDENT'),CommentController.removeDownVoteFromComment);
// router.delete('/remove-upvote-comment/:id',auth('ADMIN','STUDENT'),CommentController.removeUpVoteFromComment);


export const CommentRoutes=router;