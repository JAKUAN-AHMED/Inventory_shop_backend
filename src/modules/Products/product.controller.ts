import { prisma } from '../../prisma/client';
import catchAsync from '../../utils/catchAsync';
import { uploadToDigitalOceanAWS } from '../../utils/sendImageToCloudinary';
import sendResponse from '../../utils/sendResponse';
import { isExistUserById } from '../../utils/utility';
import { productService } from './product.service';


const createProduct = catchAsync(async (req, res) => {
  const userId=req.user.id as string;
  
  const normaluser=await prisma.user.findUnique({
    where:{
      id:userId
    }
  })

  const staf=await prisma.staf.findUnique({
    where:{
      id:userId
    }
  })
  const user=normaluser ?  normaluser : staf;

  const shopId=user?.shop as string;
  req.body.shopId=shopId as string;
  const result = await productService.createProduct(
    userId,
    req.file as Express.Multer.File,
    req.body,
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Created Product ' : 'Failed to Create Product',
    Data: isOk ? result : [],
  });
});

const allProducts = catchAsync(async (req, res) => {
  const result = await  productService.allProducts(
    req.query,
    req.user.id as string
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Retriaved all Product' : 'Failed to Retrived all Product',
    Data: isOk ? result : [],
  });
});
const singleProduct = catchAsync(async (req, res) => {
  const result = await  productService.singleProduct(
    req.params.id as string
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Retriaved  Product' : 'Failed to Retrived a Product',
    Data: isOk ? result : [],
  });
});
const deleteProduct = catchAsync(async (req, res) => {
  const result = await  productService.deleteProduct(
    req.params.id as string
  );
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Deleted  Product' : 'Failed to Deltete a Product',
    Data: isOk ? result : [],
  });
});



const updateProduct = catchAsync(async (req, res) => {
  const file = req.file as Express.Multer.File;

  if (file) {
    const { location } = await uploadToDigitalOceanAWS(file);
    req.body.img = location as string;
  }
   const userId=req.user.id as string;
  const user=await prisma.staf.findUnique({
    where:{
      id:userId
    }
  })

  const shopId=user?.shopId as string;
  req.body.shopId=shopId as string;

  const result = await productService.updateProduct(req.params.id as string,req.body);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 200 : 404,
    success: isOk,
    message: isOk ? 'Successfully Updated Product' : 'Failed to update a Product',
    Data: isOk ? result : [],
  });
});

export const ProductController = {
    createProduct,
    allProducts,
    singleProduct,
    deleteProduct,
    updateProduct
  
};
