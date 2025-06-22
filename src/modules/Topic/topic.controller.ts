import AppError from "../../errors/AppError";
import { prisma } from "../../prisma/client";
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse";
import { TopicService } from "./topic.service"


const createTopic = catchAsync(async (req, res) => {

    const isExists=await prisma.license.findFirst({
        where: {
            name: req.body.name 
        }
    });

    if (isExists) {
        throw new AppError(409,'Topic with this name already exists');
    }
  const result = await TopicService.createTopic(req.body);
  const isOk = !!result;

    sendResponse(res, {
    statusCode: isOk ? 201 : 400,
    success: isOk,
    message: isOk ? 'Topic created successfully' : 'Failed to create topic',
    Data: isOk ? result : null
  });
});


const getAllTopics = catchAsync(async (req, res) => {
    const result = await TopicService.allTopics();
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Reterived Topics' : 'Failed to Reterived Topics',
        Data: isOk ? result : [],
    });
})
const getSingleTopic = catchAsync(async (req, res) => {
    const result = await TopicService.singleTopic(req.params.id);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Retrived Topic' : 'Failed to Retrived Topic',
        Data: isOk ? result : [],
    });
})
const deleteTopic = catchAsync(async (req, res) => {
    const result = await TopicService.deleteTopic(req.params.id);
    const isOk = result ? true : false;
    sendResponse(res, {
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Deleted a Topic' : 'Failed to Delete Topic',
        Data: isOk ? result : [],
    });
})

const updateTopic = catchAsync(async (req, res) => {
    const result = await TopicService.updateTopic(req.params.id, req.body); 
    const isOk = result ? true : false;
    sendResponse(res, { 
        statusCode: isOk ? 200 : 400,
        success: isOk,
        message: isOk ? 'Successfully Updated Topic' : 'Failed to Update Topic',
        Data: isOk ? result : [],
    });
}
);




export const TopicController = {
createTopic,
getAllTopics,
getSingleTopic,
deleteTopic,
updateTopic 
}