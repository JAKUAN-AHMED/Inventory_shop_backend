import { Router } from 'express';
import auth from '../../middlewares/auth';
import { servicePlanController } from './servicePlan.controller';
const router = Router();


router.post('/create', servicePlanController.insertServicePlan);
router.get('/getall', servicePlanController.getAllServicePlan);
router.get('/getsingle/:id', servicePlanController.getSingleServicePlan);

const servicePlanRoutes = router;
export default servicePlanRoutes;