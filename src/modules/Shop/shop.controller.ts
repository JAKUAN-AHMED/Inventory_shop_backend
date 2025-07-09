import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ShopServices } from './shop.service';

const shopFromDb = catchAsync(async (req, res) => {
  const file = req.file as Express.Multer.File;

  const result = await ShopServices.shopIntoFromDB(file, req.body);
  const isok = result ? true : false;
  sendResponse(res, {
    statusCode: isok ? 201 : 400,
    success: isok,
    message: isok ? 'Shop Created Successfull' : 'Registration Failed',
    Data: isok ? result : [],
  });
});

export const ShopController = {
  shopFromDb,
};
