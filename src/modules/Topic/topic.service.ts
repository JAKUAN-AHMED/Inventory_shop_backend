import { prisma } from "../../prisma/client"
import { Topic } from "@prisma/client"


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

const allTopics=async()=>{
    return await prisma.topic.findMany({
       include:{
        licenseTopics:{
            include:{
                license:true,
                topic:{
                    include:{
                        questions:true
                    }
                }
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

const updateTopic = async (id: string, payload: Partial<Topic>) => {
    return await prisma.topic.update({
        where: {
            id
        },
        data: payload
    })
}
    
export const TopicService = {
    createTopic,
    allTopics,
    singleTopic,
    deleteTopic,
    updateTopic
}