import express, { Request, Response } from 'express';
import router from './routes/routes';
import globalErrorHandler from './middlewares/globalErrorHandler';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import NotFound from './middlewares/NotFound';

const app = express();

export const corsOptions = {
  origin: [
	  'https://ruebj-dashboard-nabil.vercel.app',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://ruebzj-frontend.vercel.app',
    "https://ruebj-dashboard-nabil.vercel.app"
  ],

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

//middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use('/api', router);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


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
