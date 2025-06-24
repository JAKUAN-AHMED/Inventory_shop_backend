
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { NotFound } from "../../utils/utility";
import { bookmarkService } from "./bookmark.service";


const addBookmark = catchAsync(async(req,res)=>{
    const payload = req.body;
    const userId = req?.user?.id;
    await NotFound(userId,'User');
    const result = await bookmarkService.addToBookmarks({
        ...payload,
        userId: userId as string
    });
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully added to bookmarks' : 'Failed to add to bookmarks',
        Data: isOk ? result : [],
    });
})

const getMyBookmarks = catchAsync(async(req,res)=>{
    const { id } = req.params;
    const userId = req?.user?.id;
    const result = await bookmarkService.getMyBookmarks(id, userId as string);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully retrieved bookmarks' : 'Failed to retrieve bookmarks',
        Data: isOk ? result : [],
    });
})
export const bookmarkController = {
    addBookmark,
    getMyBookmarks
}