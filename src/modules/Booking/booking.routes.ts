import { Router } from "express";
import auth from "../../middlewares/auth";
import { BookingController } from "./booking.controller";

const router=Router();


//create
router.post('/create-booking',auth('ADMIN'),BookingController.createBooking);


//get all
router.get('/all-booking',auth('ADMIN'),BookingController.getAllBooking);


//get single
router.get('/booking/:bookingId',auth('ADMIN'),BookingController.getSingleBooking);
export const BookingRoutes=router;