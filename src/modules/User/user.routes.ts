import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();


router.get("/singleuser/:id", UserController.getSingleUser);
router.delete("/delete/:id", UserController.deleteUser);

export const UserRoutes = router;
