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
  // Build query with pagination and includes
  const builder = new QueryBuilder(query, prisma.topic);
  const result = await builder
    .paginate()
    .include({
      questions: true,
    })
    .execute();


  // Get pagination metadata
  const meta = await builder.countTotal();

  return {
    data: result,
    meta
  };
};

const singleTopic = async (id: string) => {
  return await prisma.topic.findUnique({
    where: {
      id
    }
  })
}


const deleteTopic = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const isExist = await tx.topic.findUnique({ where: { id } });
    await NotFound(isExist, 'Which Topic You are trying to Delete This is');

    // 1. Delete related testResults
    await tx.testResult.deleteMany({ where: { topicId: id } });

    // 2. Find and delete related tests
    const tests = await tx.test.findMany({ where: { topicId: id } });

    for (const test of tests) {
      await tx.testQuestion.deleteMany({ where: { testId: test.id } });
      await tx.bookmark.deleteMany({ where: { testId: test.id } });
    }

    await tx.test.deleteMany({ where: { topicId: id } });

    // 3. Delete related saveTests
    await tx.saveTest.deleteMany({ where: { topicId: id } });

    // 4. Delete related questions and their deep relations
    const questions = await tx.question.findMany({ where: { topicId: id } });

    for (const question of questions) {
      const comments = await tx.comment.findMany({
        where: { questionId: question.id },
      });

      for (const comment of comments) {
        await tx.reply.deleteMany({ where: { commentId: comment.id } });
        await tx.downVote.deleteMany({ where: { commentId: comment.id } });
        await tx.upVotes.deleteMany({ where: { commentId: comment.id } });
      }

      await tx.comment.deleteMany({ where: { questionId: question.id } });

      await tx.testQuestion.deleteMany({ where: { questionId: question.id } });
    }

    await tx.question.deleteMany({ where: { topicId: id } });

    // 5. Finally, delete the topic
    return await tx.topic.delete({ where: { id } });
  });
};




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