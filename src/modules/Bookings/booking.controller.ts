import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingService } from './booking.service';

//create booking
const createBooking = catchAsync(async (req, res) => {
  const result = await BookingService.createBooking(req.body);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 400,
    success: isOk,
    message: isOk ? 'Successfully Booked Service' : 'Failed to Book Service',
    Data: isOk ? result : [],
  });
});

//get all booking by customer id || my booking
const getAllBookingByCustomerId = catchAsync(async (req, res) => {
  const customerId = req.user.id;
  if (!customerId) {
    throw new AppError(404, 'Login first');
  }
  const result = await BookingService.getAllBookingByCustomerId(customerId);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk
      ? 'Successfully get all booking'
      : 'Failed to get all booking',
    Data: isOk ? result : [],
  });
});

//get all booking by staf id
const getAllBookingByStafId = catchAsync(async (req, res) => {
  const stafId = req.params.id;
  if (!stafId) {
    throw new AppError(404, 'Staf Not Available');
  }
  const result = await BookingService.getAllBookingByStafId(stafId);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk
      ? 'Successfully get all booking'
      : 'Failed to get all booking',
    Data: isOk ? result : [],
  });
});

//get all booking by booking id
const getBookingById = catchAsync(async (req, res) => {
  const bookingId = req.params.id;
  if (!bookingId) {
    throw new AppError(404, 'Booking Not Found');
  }
  const result = await BookingService.getBookingById(bookingId);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk ? 'Successfully get booking' : 'Failed to get booking',
    Data: isOk ? result : [],
  });
});

//update booking by booking id
const updateBookingById = catchAsync(async (req, res) => {
  const bookingId = req.params.id;
  if (!bookingId) {
    throw new AppError(404, 'Booking Not Found');
  }
  const { status } = req.body;
  if (!status) {
    throw new AppError(404, 'Status Not Found');
  }
  if (
    status !== 'confirmed' &&
    status !== 'completed' &&
    status !== 'cancelled'
  ) {
    throw new AppError(404, 'Status Not Found');
  }
  const result = await BookingService.updateBookingById(bookingId, { status });
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk ? 'Successfully updated booking' : 'Failed to update booking',
    Data: isOk ? result : [],
  });
});

//get all booking by service id
const getAllBookingByServiceId = catchAsync(async (req, res) => {
  const serviceId = req.params.id;
  if (!serviceId) {
    throw new AppError(404, 'Service Not Found');
  }
  const result = await BookingService.getAllBookingByServiceId(serviceId);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk
      ? 'Successfully get all booking'
      : 'Failed to get all booking',
    Data: isOk ? result : [],
  });
});

//get all booking
const getAllBooking = catchAsync(async (req, res) => {
  const result = await BookingService.getAllBooking();
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk
      ? 'Successfully get all booking'
      : 'Failed to get all booking',
    Data: isOk ? result : [],
  });
});

//get booking by confirm status
const getAllConfirmBooking = catchAsync(async (req, res) => {
  const result = await BookingService.getAllConfirmedBooking();
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk
      ? 'Successfully get all confirmed booking'
      : 'Failed to get all confirmed booking',
    Data: isOk ? result : [],
  });
});
//get booking by cancelled status
const getAllCancelledBooking = catchAsync(async (req, res) => {
  const result = await BookingService.getAllCancelledBooking();
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk
      ? 'Successfully get all cancelled booking'
      : 'Failed to get all cancelled  booking',
    Data: isOk ? result : [],
  });
});
//get booking by cancelled status
const getAllCompletedBooking = catchAsync(async (req, res) => {
  const result = await BookingService.getAllCompletedBooking();
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk
      ? 'Successfully get all completed booking'
      : 'Failed to get all completed  booking',
    Data: isOk ? result : [],
  });
});

//get latest booking
const latestBooking = catchAsync(async (req, res) => {
  const result = await BookingService.latestBooking();
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 400,
    success: isOk,
    message: isOk
      ? 'Successfully retrived lastest Bookings '
      : 'Failed to retrived latest booking',
    Data: isOk ? result : [],
  });
});

//get booking by shopId
const getBookingByShopId = catchAsync(async (req, res) => {
  const shopId = req.params.id;
  if (!shopId) {
    throw new AppError(404, 'Shop Not Found');
  }
  const result = await BookingService.getAllBookingByShopId(shopId);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk
      ? 'Successfully get all booking'
      : 'Failed to get all booking',
    Data: isOk ? result : [],
  });
});


export const BookingController = {
  createBooking,
  getAllBookingByCustomerId,
  getAllBookingByStafId,
  getBookingById,
  updateBookingById,
  getAllBookingByServiceId,
  getAllBooking,
  getAllConfirmBooking,
  getAllCancelledBooking,
  getAllCompletedBooking,
  latestBooking,
  getBookingByShopId,
};
