import { get } from "http";
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { CommentService } from "./comment.service";

const createCommnent=catchAsync(async(req ,res)=>{
    const result = await CommentService.createCommnent(req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully added Comment' : 'Failed to add Comment',
        Data: isOk ? result : [],
    });
})

const updateComment=catchAsync(async(req ,res)=>{
    const {id} = req.params;
    const result = await CommentService.updateComment(id,req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully updated Comment' : 'Failed to update Comment',
        Data: isOk ? result : [],
    });
})

const deleteComment=catchAsync(async(req ,res)=>{
    const {id} = req.params;
    const result = await CommentService.deleteComment(id);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully deleted Comment' : 'Failed to delete Comment',
        Data: isOk ? result : [],
    });
})

const downVoteToComment=catchAsync(async(req ,res)=>{
    const result = await CommentService.downVoteToComment(req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully downvoted Comment' : 'Failed to downvote Comment',
        Data: isOk ? result : [],
    });
})

const upVoteToComment=catchAsync(async(req ,res)=>{
    const result = await CommentService.upVoteToComment(req.body);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully upvoted Comment' : 'Failed to upvote Comment',
        Data: isOk ? result : [],
    });
})

const removeUpVoteFromComment=catchAsync(async(req ,res)=>{
    const {id} = req.params;
    const result = await CommentService.removeUpVoteFromComment(id);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully removed upvote from Comment' : 'Failed to remove upvote from Comment',
        Data: isOk ? result : [],
    });
})

const removeDownVoteFromComment=catchAsync(async(req ,res)=>{
    const {id} = req.params;
    const result = await CommentService.removeDownVoteFromComment(id);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully removed downvote from Comment' : 'Failed to remove downvote from Comment',
        Data: isOk ? result : [],
    });
})

const getComment=catchAsync(async(req ,res)=>{
    const {id} = req.params;
    const result = await CommentService.getComment(id);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully fetched Comment' : 'Failed to fetch Comment',
        Data: isOk ? result : [],
    });
})
const getComments=catchAsync(async(req ,res)=>{
    const result = await CommentService.getComments();
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully fetched Comments' : 'Failed to fetch Comments',
        Data: isOk ? result : [],
    });
})
export const CommentController={

    createCommnent,
    updateComment,
    deleteComment,
    downVoteToComment,
    upVoteToComment,
    removeUpVoteFromComment,
    removeDownVoteFromComment,
    getComment,
    getComments
}