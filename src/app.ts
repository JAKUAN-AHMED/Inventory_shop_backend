import express, { Request, Response } from 'express';
import router from './routes/routes';
import globalErrorHandler from './middlewares/globalErrorHandler';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import NotFound from './middlewares/NotFound';
import { SubscriptionController } from './modules/Subscriptions/subscription.controller';
import path from 'path';

const app = express();

export const corsOptions = {
  origin: [
    'http://localhost:8090','https://justuska-2.vercel.app',
   
  ],

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};


app.post(
  '/api/webhook',
  express.raw({ type: 'application/json' }),
  SubscriptionController.webhook,
);

//middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use('/api', router);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); 

//test route
const test = async (req: Request, res: Response) => {
  const sayHi = 'Hi world!';
  res.send(sayHi);
};
app.get('/', test);
//gloabal err handler
app.use(globalErrorHandler);



//Not Found Route
app.use(NotFound);

export default app;
