import QueryBuilder from "../../builder/QueryBuilder";
import { prisma } from "../../prisma/client"
import { Topic } from "@prisma/client"
import { NotFound } from "../../utils/utility";


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

const allTopics = async (query: any) => {

  const builder = new QueryBuilder(query, prisma.topic);
  const result = await builder
    .paginate()
    .include({
      licenseTopics: {
        include: {
          license: true,
          topic: {
            include: {
              questions: true
            }
          }
        }
      }
    })
    .execute();

  const meta = await builder.countTotal();

  return ({
    data: result,
    meta
  })
}

const singleTopic = async (id: string) => {
  return await prisma.topic.findUnique({
    where: {
      id
    }
  })
}


const deleteTopic = async (id: string) => {

  const isExist = await prisma.topic.findUnique({
    where: {
      id
    }
  })

  await NotFound(isExist, 'Which Topic You are trying to Delete This is');

  //delete relation from license topic
  await prisma.licenseTopic.deleteMany({
    where: {
      topicId: id
    }
  })

  return await prisma.topic.delete({
    where: {
      id
    }
  })
}

const updateTopic = async (
  id: string,
  payload: Partial<Topic> & { licenseIds?: string[] | string }
) => {
  const { licenseIds, ...topicData } = payload;

  // Update the topic base fields
  const updatedTopic = await prisma.topic.update({
    where: { id },
    data: topicData,
  });

  // Handle licenseIds if provided
  if (licenseIds) {
    // Normalize to array
    const ids = Array.isArray(licenseIds) ? licenseIds : [licenseIds];

    // Map to relation objects
    const relations = ids.map(licenseId => ({
      topicId: id,
      licenseId,
    }));

    // Push relations
    await prisma.licenseTopic.createMany({
      data: relations
    });
  }

  return updatedTopic;
};


export const TopicService = {
  createTopic,
  allTopics,
  singleTopic,
  deleteTopic,
  updateTopic
}