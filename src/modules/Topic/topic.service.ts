import { HttpStatusCode } from "axios"
import { prisma } from "../../prisma/client"
import { Topic } from "@prisma/client"
import { isExistUserById, NotFound } from "../../utils/utility";

const createTopic = async (payload: Topic & { licenseIds: string[] }) => {
  const { licenseIds, ...topicData } = payload;

  // 1. Create the topic
  const topic = await prisma.topic.create({
    data: topicData
  });

  // 2. Create many-to-many relations
  const relations = licenseIds.map(licenseId => ({
    topicId: topic.id,
    licenseId
  }));

  await prisma.licenseTopic.createMany({ data: relations });

  return topic;
};


const addAnotherLixenseToTopic = async (topicId: string, licenseId: string) => {
    // Check if the topic exists
    const topic = await isExistUserById(topicId);
    await NotFound(topic, `Topic Id`);
    
    // Check if the license exists
    const license = await prisma.license.findUnique({
        where: { id: licenseId }
    });
    if (!license) {
        throw new Error(`License with ID ${licenseId} not found`);
    }
    // Create the relation
    const relation = await prisma.licenseTopic.create({
        data: {
            topicId,
            licenseId
        }
    });
    return relation;
};

const allTopics=async()=>{
    return await prisma.topic.findMany({
       include:{
        licenseTopics:{
            include:{
                license:true
            }
        }
       }
    })
}

const singleTopic=async(id:string)=>{
    return await prisma.topic.findUnique({
        where:{
            id
        }
    })
}


const deleteTopic = async (id: string) => {
    return await prisma.topic.delete({
        where: {
            id
        }
    })
}
export const TopicService = {
    createTopic,
    allTopics,
    singleTopic,
    deleteTopic
}