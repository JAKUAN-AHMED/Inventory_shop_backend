import express from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { UserRoutes } from '../modules/User/user.routes';
import { ContactRoutes } from '../modules/Contact/contact.routes';
import { LicenseRoutes } from '../modules/License/licence.route';
import { TopicRoutes } from '../modules/Topic/topic.route';
import { questionRouter } from '../modules/Questions/question.route';
import { AnswerRoutes } from '../modules/Answers/answer.route';
import { TestRoutes } from '../modules/Test/test.route';
import { testQRouter } from '../modules/TestQuestions/testQ.route';
import { testResultRoute } from '../modules/TestResult/testR.route';
import { explanationsRouter } from '../modules/Explanations/explanations.route';
import { bookmarkRoute } from '../modules/Bookmarks/bookmark.route';
import { CommentRoutes } from '../modules/Comments/comment.route';


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
  },{
    path:'/test-questions',
    route:testQRouter
  },{
    path:'/test-result',
    route:testResultRoute
  },
  {
    path:'/explanation',
    route:explanationsRouter
  },
  {
    path:'/bookmark',
    route:bookmarkRoute
  },
  {
    path:'/comment',
    route:CommentRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));


export default router;
