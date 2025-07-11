import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../middlewares/auth';
import { StafController } from './staf.controller';
import { upload } from '../../utils/sendImageToCloudinary';
import validateRequest from '../../middlewares/validateRequest';
import { stafValidationSchema } from './staf.validation';

const router = Router();

//create staf and send password to him
router.post(
  '/create-staf',
  auth('BUSINESS'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.body.data === 'string') {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(stafValidationSchema),
  StafController.createStaf,
);

//all staf
router.get('/all-staf',auth('BUSINESS'),StafController.allStaf);
router.get('/single-staf/:id',auth('BUSINESS'),StafController.singleStaf);
router.delete('/delete-staf/:id',auth('BUSINESS'),StafController.deleteStaf);
export const StafRoutes = router;
