import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ConatactService } from './contact.service';

const contact = catchAsync(async (req, res) => {
  
  const {
    name,
    email,
    subject = 'New Contact Form Submission',
    phone,
    message,
  } = req.body;

  // Input validation
  if (!email || !name || !message) {
    throw new AppError(400, 'Name, email, and message are required');
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Contact Message</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px #ddd;">
          <h2 style="color: #333;">📩 New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-line; background: #f0f0f0; padding: 10px; border-radius: 5px;">${message}</p>
          <hr style="margin-top: 30px;" />
          <p style="font-size: 12px; color: #999;">This message was sent from your website contact form.</p>
        </div>
      </body>
    </html>
  `;

  const result = await ConatactService.contact(req.body,htmlContent);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '',
    Data: result,
  });
  
});

export const ContactController = { contact };
