import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { BookinServices } from "./booking.service"


const createBooking = catchAsync(async (req, res) => {
    const result = await BookinServices.createBooking(req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 201 : 400,
        success: isOk,
        message: isOk ? "Successfully Created Booking" : "Failed to Create Booking",
        Data: isOk ? result : []
    })

})


const getSingleBooking = catchAsync(async (req, res) => {
    const result = await BookinServices.getSingleBooking(req.params.bookingId);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 201 : 400,
        success: isOk,
        message: isOk ? "Successfully retrived Booking" : "Failed to retrieved Booking ",
        Data: isOk ? result : []
    })

})

const getAllBooking = catchAsync(async (req, res) => {
    const result = await BookinServices.getAllBooking();
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 201 : 400,
        success: isOk,
        message: isOk ? "Successfully retrived Booking" : "Failed to retrieved Booking ",
        Data: isOk ? result : []
    })

})


export const BookingController = {
    createBooking,
    getAllBooking,
    getSingleBooking
}