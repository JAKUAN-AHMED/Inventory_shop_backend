import { Router } from "express"
import auth from "../../middlewares/auth";
import { TopicController } from "./topic.controller";

const router=Router();


router.post('/createTopic',auth('ADMIN','INSTRUCTOR'),TopicController.createTopic);
router.get('/Topics',auth('ADMIN','INSTRUCTOR','STUDENT'),TopicController.getAllTopics);
router.get('/topic',auth('ADMIN','INSTRUCTOR','STUDENT'),TopicController.getSingleTopic);
router.delete('/deleteTopic',auth('ADMIN','INSTRUCTOR'),TopicController.deleteTopic);
export const TopicRoutes=router;
