import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { VoteService } from "./vote.service"

const giveDownVote = catchAsync(async (req, res) => {
    req.body.userId = req.user.id;
    const result = await VoteService.giveDownVote(req.body)
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully  Given downvote' : 'Failed to Give downvote',
        Data: isOk ? result : [],
    });
})

const giveUpVote = catchAsync(async (req, res) => {
    req.body.userId = req.user.id;
    const result = await VoteService.giveUpvote(req.body)
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully  Given upVote' : 'Failed to Give upVote',
        Data: isOk ? result : [],
    });
})
export const VoteController = {
    giveDownVote,
    giveUpVote

}