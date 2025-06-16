import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';


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
        getSingleUser,
        deleteUser,
};