import { Router } from "express";
import auth from "../../middlewares/auth";
import { ContactController } from "./contact.controller";

const router=Router();

//sent email for contact
router.post('/send',ContactController.contact);


export const ContactRoutes=router;