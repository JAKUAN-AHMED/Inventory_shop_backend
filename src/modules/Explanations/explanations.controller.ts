import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { explanationsService } from "./explanations.service"

const addExplanation = catchAsync(async (req, res) => {
    const result = await explanationsService.addExplanation(req.body)
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully added Explanation' : 'Failed to add Explanation',
        Data: isOk ? result : [],
    });
})


const updateExplanation = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await explanationsService.updateExplanation(id, req.body)
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully updated Explanation' : 'Failed to update Explanation',
        Data: isOk ? result : [],
    });
})


const ratingExplanation = catchAsync(async (req, res) => {
    const result = await explanationsService.ratingExplanation(req.body)
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully rated Explanation' : 'Failed to rate Explanation',
        Data: isOk ? result : [],
    });
})


const deleteExplanation = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await explanationsService.deleteExplanation(id)
    const isOk = result ? true : false; 
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully deleted Explanation' : 'Failed to delete Explanation',
        Data: isOk ? result : [],
    });
})
export const explanationsController = {
    addExplanation,
    updateExplanation,
    ratingExplanation,
    deleteExplanation
}