import { Router } from "express";
import auth from "../../middlewares/auth";
import { BookingController } from "./booking.controller";


const router=Router();

//create booking
router.post('/create',
BookingController.createBooking
);


//all booking
router.get('/all',auth('ADMIN','BUSINESS','USER'),
BookingController.getAllBooking);


//all booking by customer id
router.get('/allbooking/customer',auth('ADMIN','BUSINESS','USER'),
BookingController.getAllBookingByCustomerId);

//all booking by staf id
router.get('/allbooking/staf/:id',auth('ADMIN','BUSINESS','USER'),
BookingController.getAllBookingByStafId);

//get booking by booking id
router.get('/booking/:id',auth('ADMIN','BUSINESS','USER'),
BookingController.getBookingById);



//update booking status by booking id
router.patch('/booking/:id',auth('ADMIN','BUSINESS','USER'),
BookingController.updateBookingById);

//get all booking by service id
router.get('/allbooking/service/:id',auth('ADMIN','BUSINESS','USER'),
BookingController.getAllBookingByServiceId);


//confirmed booking
router.get('/confirm',auth('BUSINESS','ADMIN'),BookingController.getAllConfirmBooking)

//cancelled booking
router.get('/cancelled',auth('ADMIN','BUSINESS'),BookingController.getAllCancelledBooking);

//completed booking
router.get('/completed',auth('ADMIN','BUSINESS'),BookingController.getAllCompletedBooking);

//latest booking
router.get('/latest',auth('BUSINESS','ADMIN'),BookingController.latestBooking);

//get booking by shopId
router.get('/allbooking/shop/:id',auth('ADMIN','BUSINESS'),
BookingController.getBookingByShopId);

export const BookingRoutes=router;