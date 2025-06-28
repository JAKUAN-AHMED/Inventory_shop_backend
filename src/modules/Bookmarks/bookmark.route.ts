import { Router } from "express";
import auth from "../../middlewares/auth";
import { bookmarkController } from "./bookmark.controller";

const router=Router();
router.post('/add-bookmark',auth('STUDENT','ADMIN'),bookmarkController.addBookmark);
router.get('/my-bookmarks', auth('STUDENT','ADMIN'), bookmarkController.getMyBookmarks);
router.get('/single-bookmark/:id', auth('STUDENT','ADMIN'), bookmarkController.singleBookmarks);
router.delete('/delete-bookmark/:id', auth('STUDENT','ADMIN'), bookmarkController.deleteMyBookmark);
export const bookmarkRoute = router;