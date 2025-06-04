import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { testimonialService } from "./testimonial.service";


const createTestimonial = catchAsync(async (req, res) => {
  const result = await testimonialService.createTestimonial(req.body);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 400,
    success: isOk,
    message: isOk
      ? "Successfully Created Testimonial"
      : "Failed to Create Testimonial",
    Data: isOk ? result : [],
  });
});


const getAllTestimonial = catchAsync(async (req, res) => {
  const result = await testimonialService.getAllTestimonial();
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 400,
    success: isOk,
    message: isOk
      ? "Successfully get all Testimonial"
      : "Failed to get all Testimonial",
    Data: isOk ? result : [],
  });
});



export const testimonialController = {  
    createTestimonial,
    getAllTestimonial
};