import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

router.post("/create", UserController.createUser);
router.get("/alluser", UserController.getAllUser);
router.get("/singleuser/:id", UserController.getSingleUser);
router.patch("/update/:id", UserController.updateUser);
router.delete("/delete/:id", UserController.deleteUser);

export const UserRoutes = router;
