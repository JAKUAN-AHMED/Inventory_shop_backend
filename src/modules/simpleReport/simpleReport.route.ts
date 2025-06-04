import { Router } from 'express';
import auth from '../../middlewares/auth';
import { SimpleReportController } from './simpleReport.controller';

const router = Router();

router.post('/create', auth('ADMIN'),SimpleReportController.createSimpleResport);
router.get('/all/:id', auth('ADMIN'), SimpleReportController.getSimpleReportById); 

const simpleReportRoutes = router;
export default simpleReportRoutes;

