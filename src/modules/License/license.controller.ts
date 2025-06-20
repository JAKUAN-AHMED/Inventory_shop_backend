import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { LicenseService } from "./license.service"

//create
const createLicense = catchAsync(async (req, res) => {
    const result = await LicenseService.createLicense(req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 201 : 400,
        success: isOk,
        message: isOk ? 'Successfully Created a License' : 'Failed to Create a License',
        Data: isOk ? result : [],
    });
})

//get all
const getAllLicense = catchAsync(async (req, res) => {
    const result = await LicenseService.getAllLicense();
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Retrived All Licenses' : 'Failed to  Retrieve All Licenses',
        Data: isOk ? result : [],
    });
})



//update License
const updateLicense = catchAsync(async (req, res) => {
    const result = await LicenseService.updateLicense(req.params.id, req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Updated a License' : 'Failed to Update a License',
        Data: isOk ? result : [],
    });
}
);


//single license
const singleLicense = catchAsync(async (req, res) => {
    const result = await LicenseService.getSingleLicense(req.params.id);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Retrived  License' : 'Failed to Retrive a License Data',
        Data: isOk ? result : [],
    });
})

//Delete License
const deleteLicense = catchAsync(async (req, res) => {
    const result = await LicenseService.deleteLicense(req.params.id);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Delete a  License' : 'Failed to Delete a License Data',
        Data: isOk ? result : [],
    });
})


export const LicenseController = {
    createLicense,
    getAllLicense,
    singleLicense,
    deleteLicense,
    updateLicense

}