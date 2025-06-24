import { Router } from "express";
import auth from "../../middlewares/auth";
import { bookmarkController } from "./bookmark.controller";

const router=Router();
router.post('/add-bookmark',auth('STUDENT','ADMIN'),bookmarkController.addBookmark);
router.get('/my-bookmarks/:id', auth('STUDENT','ADMIN'), bookmarkController.getMyBookmarks);
export const bookmarkRoute = router;