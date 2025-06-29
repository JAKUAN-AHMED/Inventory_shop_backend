import QueryBuilder from "../../builder/QueryBuilder";
import { prisma } from "../../prisma/client"
import { Topic } from "@prisma/client"
import { NotFound } from "../../utils/utility";
import AppError from "../../errors/AppError";


const createTopic = async (payload: Topic & { licenseIds: string[] }) => {
  const isExist = await prisma.topic.findUnique({
    where: { name: payload.name },
  });

  if (isExist) {
    throw new AppError(409, 'Already Exist This Topic');
  }

  if (payload.licenseIds.length === 0) {
    throw new AppError(400, 'Must be Provide LicenseIds at least One');
  }

  const { licenseIds, ...topicData } = payload;

  const [topic] = await prisma.$transaction(async (prisma) => {
    const createdTopic = await prisma.topic.create({
      data: topicData,
    });

    await prisma.licenseTopic.createMany({
      data: licenseIds.map((licenseId) => ({
        licenseId: licenseId,
        topicId: createdTopic.id,
      })),
    });

    return [createdTopic];
  });

  return topic;
};


const allTopics = async (query: any) => {
  // Build query with pagination and includes

  // return await prisma.topic.findMany();
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
    addLicenseIds?: string[];
    removeLicenseIds?: string[];
  }
) => {
  // Check if topic exists
  const topic = await prisma.topic.findUnique({
    where: { id },
  });
  if (!topic) throw new Error('Topic not found');

  // Destructure license updates from payload
  const { addLicenseIds, removeLicenseIds, ...topicFields } = payload;

  // Prepare Prisma transaction to update everything atomically
  const transactionOperations = [];

  // 1. Update topic's own fields (if any)
  if (Object.keys(topicFields).length > 0) {
    transactionOperations.push(
      prisma.topic.update({
        where: { id },
        data: topicFields,
      })
    );
  }

  // 2. Add license relations by creating LicenseTopic entries
  if (addLicenseIds && addLicenseIds.length > 0) {
    const createData = addLicenseIds.map((licenseId:string) => ({
      licenseId:licenseId ,
      topicId:id,
    }));
    transactionOperations.push(prisma.licenseTopic.createMany({
      data: createData,
    }));
  }

  // 3. Remove license relations by deleting LicenseTopic entries
  if (removeLicenseIds && removeLicenseIds.length > 0) {
    transactionOperations.push(
      prisma.licenseTopic.deleteMany({
        where: {
          topicId: id,
          licenseId: { in: removeLicenseIds.map((l:string) =>l) },
        },
      })
    );
  }

  // Run all operations in a single transaction
  await prisma.$transaction(transactionOperations);

  // Return updated topic including its licenses (optional)
  const updatedTopic = await prisma.topic.findUnique({
    where: { id },
    include: {
      licenseTopics: {
        include: {
          license: true,
        },
      },
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