import { License } from "@prisma/client";
import { prisma } from "../../prisma/client"
import { NotFound } from "../../utils/utility";
import QueryBuilder from "../../builder/QueryBuilder";




//create
const createLicense = async (payload: License) => {

  // 1. Create the topic
  const result = await prisma.license.create({
    data: payload
  });

  return result;
}

//get all
const getAllLicense = async (query: any) => {
  const builder = new QueryBuilder(query, prisma.license);

  const result = await builder
    .paginate()
    .execute();

  const meta = await builder.countTotal();

  return {
    data: result,
    meta,
  };
}
//get single
const getSingleLicense = async (id: string) => {

  return await prisma.license.findUnique({
    where: {
      id,
    },
    include: {
      licenseTopics: {
        include: {
          topic: {
            include: {
              questions: {
                include: {
                  bookmarks: true,
                  comments: {
                    include: {
                      upVote: true,
                      downVote: true,
                      replies: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

  })
}
const MyLicense = async (id: string, userId: string) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: {
      plan: {
        select: {
          license: {
            select: {
              name: true,
              licenseTopics: {
                select: {
                  topic: {
                    select: {
                      id: true,
                      name: true,
                      _count: {
                        select: {
                          questions: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return subscription;
};



//update license
const updateLicense = async (
  id: string,
  payload: Partial<License>
) => {


  // 1. Check if license exists
  const licenseExists = await prisma.license.findUnique({
    where: { id },
  });
  await NotFound(licenseExists, "License");


  // 3. Update the license data
  return await prisma.license.update({
    where: { id },
    data: payload,
  });
};



//delete single

// import { ObjectId } from 'bson';

const deleteLicense = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const licenseId =id as string;

    // 1. Check if license exists
    const license = await tx.license.findUnique({ where: { id } });
    await NotFound(license, 'License');

    // 2. Delete SaveTests for license
    await tx.saveTest.deleteMany({ where: { licenseId: id } });

    // 3. Delete Plans for license
    await tx.plan.deleteMany({ where: { licenseId: id } });

    // 4. Handle Topics linked via LicenseTopic join table
    // Find topicIds linked to this license via LicenseTopic
    const licenseTopics = await tx.licenseTopic.findMany({
      where: { licenseId: licenseId },
      select: { topicId: true },
    });
    const topicIds = licenseTopics.map((lt) => lt.topicId);

    for (const topicId of topicIds) {
      // Delete TestResults for topic
      
      // Find Tests under topic
      const tests = await tx.test.findMany({ where: { topicId } });
      await tx.testResult.deleteMany({ where: { topicId } });

      for (const test of tests) {
        await tx.testQuestion.deleteMany({ where: { testId: test.id } });
        await tx.bookmark.deleteMany({ where: { testId: test.id } });
        await tx.testResult.deleteMany({ where: { testId: test.id } });
      }

      await tx.test.deleteMany({ where: { topicId } });
      await tx.saveTest.deleteMany({ where: { topicId } });

      // Handle questions and related comments/replies/votes
      const questions = await tx.question.findMany({ where: { topicId } });

      for (const question of questions) {
        const comments = await tx.comment.findMany({ where: { questionId: question.id } });

        for (const comment of comments) {
          await tx.reply.deleteMany({ where: { commentId: comment.id } });
          await tx.downVote.deleteMany({ where: { commentId: comment.id } });
          await tx.upVotes.deleteMany({ where: { commentId: comment.id } });  // fixed upVote spelling
        }

        await tx.comment.deleteMany({ where: { questionId: question.id } });
        await tx.testQuestion.deleteMany({ where: { questionId: question.id } });
      }

      await tx.question.deleteMany({ where: { topicId } });

      // Delete LicenseTopic rows for this topic and license (important!)
      await tx.licenseTopic.deleteMany({
        where: {
          licenseId: licenseId,
          topicId: topicId,
        },
      });

      // Finally delete topic
      await tx.topic.delete({ where: { id: topicId } });
    }

    // 5. Delete any remaining tests linked directly to license (if your schema allows that)
    const remainingTests = await tx.test.findMany({ where: { licenseId: id } });

    for (const test of remainingTests) {
      await tx.testQuestion.deleteMany({ where: { testId: test.id } });
      await tx.bookmark.deleteMany({ where: { testId: test.id } });
      await tx.testResult.deleteMany({ where: { testId: test.id } });
    }

    await tx.test.deleteMany({ where: { licenseId: id } });

    // 6. Delete LicenseTopic rows related to this license (if any left)
    await tx.licenseTopic.deleteMany({ where: { licenseId: licenseId } });

    // 7. Finally, delete the license itself
    return await tx.license.delete({ where: { id } });
  });
};


export const LicenseService = {
  createLicense,
  getAllLicense,
  getSingleLicense,
  deleteLicense,
  updateLicense,
  MyLicense
}