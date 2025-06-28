import { Request, Router, Response, NextFunction } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { upload } from '../../helpers/FileUpload';


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



export const UserRoutes = router;
