import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SaveTestService } from './savetest.service';


const SaveTest=catchAsync(async(req,res)=>{

    req.body.userId=req.user.id as string;
    const result=await SaveTestService.saveTest(req.body);
    const isOk=result? true:false;
    sendResponse(res,{
        statusCode:isOk?201:400,
        success:isOk,
        message:isOk ? "Successfully Saved a Test": "Failed to Save a Test",
        Data:isOk?result : []
    })
})  
const MySaveTest=catchAsync(async(req,res)=>{

   
    const result=await SaveTestService.MySaveTest(req.user.id as string);
    const isOk=result.length>0 ? true:false;
    sendResponse(res,{
        statusCode:isOk?201:400,
        success:isOk,
        message:isOk ? "Successfully Retrived My Saved Test": "Failed to Retrived My Saved Test",
        Data:isOk?result : []
    })
})  
const mySingleSaveTest=catchAsync(async(req,res)=>{
    const result=await SaveTestService.mySingleSaveTest(req.user.id as string,req.params.id);
    const isOk=result? true:false;
    sendResponse(res,{
        statusCode:isOk?201:400,
        success:isOk,
        message:isOk ? "Successfully Retrived My Saved Test": "Failed to Retrived My Saved Test",
        Data:isOk?result : []
    })
})  
const DeletemySingleSaveTest=catchAsync(async(req,res)=>{

    const result=await SaveTestService.DeletemySingleSaveTest(req.user.id as string,req.params.id);
    const isOk=result? true:false;
    sendResponse(res,{
        statusCode:isOk?201:400,
        success:isOk,
        message:isOk ? "Successfully  Deleted S a Save Test": "Failed to Delete  a Save Test",
        Data:isOk?result : []
    })
})  


export const SaveTestController={
    SaveTest,
    MySaveTest,
    mySingleSaveTest,
    DeletemySingleSaveTest
}