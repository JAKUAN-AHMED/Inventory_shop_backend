import express from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { UserRoutes } from '../modules/User/user.routes';
import { ContactRoutes } from '../modules/Contact/contact.routes';
import { LicenseRoutes } from '../modules/License/licence.route';
import { TopicRoutes } from '../modules/Topic/topic.route';
import { questionRouter } from '../modules/Questions/question.route';
import { AnswerRoutes } from '../modules/Answers/answer.route';
import { TestRoutes } from '../modules/Test/test.route';


const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/contact',
    route: ContactRoutes,
  },
  {
    path: '/license',
    route: LicenseRoutes,
  },
  {
    path: '/topic',
    route: TopicRoutes,
  },
  {
    path: '/question',
    route: questionRouter,
  },
  {
    path: '/answer',
    route: AnswerRoutes,
  },
  {
    path: '/test',
    route: TestRoutes
  }

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));


export default router;
