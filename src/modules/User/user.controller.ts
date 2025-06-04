import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';


const createUser = catchAsync(async (req, res) => {
    const result = await UserServices.createUser(req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 201 : 400,
        success: isOk,
        message: isOk ? 'Successfully Created User' : 'Failed to Create User',
        Data: isOk ? result : [],
    });
    }
);


const getAllUser = catchAsync(async (req, res) => {
    const result = await UserServices.getAllUser();
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully get all User' : 'Failed to get all User',
        Data: isOk ? result : [],
    });
});



const getSingleUser = catchAsync(async (req, res) => {
    const result = await UserServices.getingSigleuser(req.params.id);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully get all User' : 'Failed to get all User',
        Data: isOk ? result : [],
    });
});



const updateUser = catchAsync(async (req, res) => {
    const result = await UserServices.updateUser(req.params.id, req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Updated User' : 'Failed to Update User',
        Data: isOk ? result : [],
    });
});



const deleteUser = catchAsync(async (req, res) => {
    const result = await UserServices.deleteduser(req.params.id);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Deleted User' : 'Failed to Delete User',
        Data: isOk ? result : [],
    });
});



export const UserController = {
        createUser,
        getAllUser,
        getSingleUser,
        updateUser,
        deleteUser,
};