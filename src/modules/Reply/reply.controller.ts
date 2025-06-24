import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { ReplyService } from "./reply.service";

const createReply=catchAsync(async(req,res)=>{
    const result = await ReplyService.createReply(req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully added Reply' : 'Failed to add Reply',
        Data: isOk ? result : [],
    });
})


const updateReply=catchAsync(async(req,res)=>{
    const {id} = req.params;
    const result = await ReplyService.updateReply(id,req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully updated Reply' : 'Failed to update Reply',
        Data: isOk ? result : [],
    });
})
const deleteReply=catchAsync(async(req,res)=>{
    const {id} = req.params;
    const result = await ReplyService.deleteReply(id);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully deleted Reply' : 'Failed to delete Reply',
        Data: isOk ? result : [],
    });
})  
export const ReplyController={
    createReply,
    updateReply,
    deleteReply
}