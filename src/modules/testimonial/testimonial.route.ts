
import { Router } from 'express';
import auth from "../../middlewares/auth";
import { testimonialController } from './testimonial.controller';

const router = Router();

router.post("/create", auth('ADMIN'),testimonialController.createTestimonial);
router.get("/all", testimonialController.getAllTestimonial);


export const TestimonialRoutes = router;






