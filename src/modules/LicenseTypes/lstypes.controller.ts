import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { LSServices } from "./lstypes.service";

const addLsType=catchAsync(async(req,res)=>{
    
    const result=await LSServices.AddLsType(req.body);
    const isOk=result? true : false;
    sendResponse(res,({
        statusCode:isOk? 201 : 400,
        success:isOk,
        message:isOk ? "Successfully Created a License Type": "Failed to Create License Type",
        Data:isOk? result: [] 
    }))
})
const getAllLicenseTypes=catchAsync(async(req,res)=>{
    const result=await LSServices.getAllLicenseTypes();
    const isOk=result?.length>0? true : false;
    sendResponse(res,({
        statusCode:isOk? 200 : 400,
        success:isOk,
        message:isOk ? "Successfully Retrived All License Type": "Failed to Retrive All License Type",
        Data:isOk? result: [] 
    }))
})
const DeleteLsType=catchAsync(async(req,res)=>{
    const result=await LSServices.DeleteLsType(req.params.id);
    const isOk=result? true : false;
    sendResponse(res,({
        statusCode:isOk? 200 : 400,
        success:isOk,
        message:isOk ? "Successfully Delete a License Type": "Failed to Delete a License Type",
        Data:isOk? result: [] 
    }))
})
const updateLsType=catchAsync(async(req,res)=>{
    const result=await LSServices.updateLsType(req.params.id,req.body.title);
    const isOk=result? true : false;
    sendResponse(res,({
        statusCode:isOk? 200 : 400,
        success:isOk,
        message:isOk ? "Successfully Updated a License Type": "Failed to Update License Type",
        Data:isOk? result: [] 
    }))
})
const SingleLsType=catchAsync(async(req,res)=>{
    const result=await LSServices.SingleLsType(req.params.id);
    const isOk=result? true : false;
    sendResponse(res,({
        statusCode:isOk? 200 : 400,
        success:isOk,
        message:isOk ? "Successfully Retrived a License Type": "Failed to Retrive a License Type",
        Data:isOk? result: [] 
    }))
})


export const LsTypeController={
    addLsType,
    getAllLicenseTypes,
    SingleLsType,
    DeleteLsType,
    updateLsType
}