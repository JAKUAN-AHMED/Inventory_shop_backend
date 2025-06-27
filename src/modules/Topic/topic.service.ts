import QueryBuilder from "../../builder/QueryBuilder";
import { prisma } from "../../prisma/client"
import { Topic } from "@prisma/client"
import { NotFound } from "../../utils/utility";
import AppError from "../../errors/AppError";


const createTopic = async (payload: Topic) => {

  const isExist = await prisma.topic.findUnique({
    where: {
      name: payload.name
    }
  })

  if (isExist) {
    throw new AppError(409, 'Already Exist This Topic');
  }

  if (payload.licenseIds.length == 0) {
    throw new AppError(400, 'Must be Provide LicenseIds at least One');
  }

  // 1. Create the topic
  const topic = await prisma.topic.create({
    data: payload
  });

  return topic;
};

const allTopics = async (query: any) => {

  const builder = new QueryBuilder(query, prisma.topic);
  const result = await builder
    .paginate()
    .include({
      include: {
        license: true,
        topic: {
          include: {
            questions: true
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
  return await prisma.topic.delete({
    where: {
      id
    }
  })
}

const updateTopic = async (
  id: string,
  payload: Partial<Topic> & {
    addLicenseIds?: string[],
    removeLicenseIds?: string[]
  }
) => {
  const topic = await prisma.topic.findUnique({
    where: { id },
    select: { licenseIds: true }
  });

  if (!topic) throw new Error('Topic not found');

  let updatedLicenseIds = topic.licenseIds || [];

  // Add new licenseIds (remove duplicates)
  if (payload.addLicenseIds) {
    updatedLicenseIds = Array.from(new Set([...updatedLicenseIds, ...payload.addLicenseIds]));
  }

  // Remove licenseIds
  if (payload.removeLicenseIds) {
    updatedLicenseIds = updatedLicenseIds.filter(id => !payload.removeLicenseIds?.includes(id));
  }

  // Remove custom fields from payload to avoid invalid Prisma update
  const { addLicenseIds, removeLicenseIds, ...validPayload } = payload;

  const updatedTopic = await prisma.topic.update({
    where: { id },
    data: {
      ...validPayload,
      licenseIds: updatedLicenseIds,
    },
  });

  return updatedTopic;
};



export const TopicService = {
  createTopic,
  allTopics,
  singleTopic,
  deleteTopic,
  updateTopic
}