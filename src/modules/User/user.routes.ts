import { Request, Router, Response, NextFunction } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { upload } from '../../utils/sendImageToCloudinary';
// import { upload } from '../../helpers/FileUpload';


const router = Router();


router.get("/singleuser/:id", UserController.getSingleUser);
router.delete("/deleteUser/:id", auth('ADMIN'), UserController.deleteUser);
router.get('/alluser', auth('ADMIN'), UserController.getAllUser);
router.patch('/updateProfile/:id',
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        if (typeof req.body.data === 'string') {
            req.body = JSON.parse(req.body.data);
        }
        next();
    }, auth('ADMIN', 'INSTRUCTOR', 'STUDENT'), UserController.updateProfile);

router.get('/user-analytics',auth('STUDENT','ADMIN'),UserController.getUserTestAnalytics);

router.get('/package-info',auth('ADMIN','STUDENT'),UserController.packagesApi);
export const UserRoutes = router;
