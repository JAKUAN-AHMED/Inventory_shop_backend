import { prisma } from '../../prisma/client';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { suppliersService } from './suppliers.service';

const createSupplier = catchAsync(async (req, res) => {
  const userId = req.user.id as string;
  const normaluser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const staf = await prisma.staf.findUnique({
    where: {
      id: userId,
    },
  });
  const user = normaluser ? normaluser : staf;

  const shop = await prisma.shop.findUnique({
    where: {
      userId: user?.id as string,
    },
  });
  req.body.shopId = shop?.id as string;
  req.body.userId = userId;
  req.body.file = req.file?.filename as string;

  const result = await suppliersService.createSupplier(req.body);
  const isOk = result ? true : false;
  sendResponse(res, {
    statusCode: isOk ? 201 : 404,
    success: isOk,
    message: isOk ? 'Successfully Created Supplier' : 'Failed to Create Supplier',
    Data: isOk ? result : [],
  });
});

//update supplier
const updateSupplier=catchAsync(async(req,res)=>{
    const userId = req.user.id as string;
    const normaluser = await prisma.user.findUnique({
        where: {
        id: userId,
        },
    });
    
    const staf = await prisma.staf.findUnique({
        where: {
        id: userId,
        },
    });
    const user = normaluser ? normaluser : staf;
    
    const shop = await prisma.shop.findUnique({
        where: {
        userId: user?.id as string,
        },
    });
    req.body.shopId = shop?.id as string;
    req.body.userId = userId;
    req.body.file = req.file?.filename as string;
    
    const result = await suppliersService.updateSupplier(req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 404,
        success: isOk,
        message: isOk ? 'Successfully Updated Supplier' : 'Failed to Update Supplier',
        Data: isOk ? result : [],
    });
})

//delete supplier
const deleteSupplier = catchAsync(async (req, res) => {
    const userId = req.user.id as string;
    const { id } = req.params;

    const result = await suppliersService.deleteSupplier(id, userId);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 404,
        success: isOk,
        message: isOk ? 'Successfully Deleted Supplier' : 'Failed to Delete Supplier',
        Data: isOk ? result : [],
    });
});


//get all suppliers
const getAllSuppliers = catchAsync(async (req, res) => {
    const userId = req.user.id as string;
    const query = req.query;

    const result = await suppliersService.getAllSuppliers(userId, query);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 404,
        success: isOk,
        message: isOk ? 'Successfully Retrieved Suppliers' : 'Failed to Retrieve Suppliers',
        Data: isOk ? result : [],
    });
});


//get single supplier
const getSingleSupplier = catchAsync(async (req, res) => {
    const userId = req.user.id as string;
    const { id } = req.params;

    const result = await suppliersService.getSupplierById(id, userId);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 404,
        success: isOk,
        message: isOk ? 'Successfully Retrieved Supplier' : 'Failed to Retrieve Supplier',
        Data: isOk ? result : [],
    });
});

export const suppliersController = {
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getAllSuppliers,
    getSingleSupplier
};