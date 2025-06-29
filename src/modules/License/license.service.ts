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
        .include({
            topics: true
        })
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
            id
        },
        include: {
            topics: true
        }

    })
}


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

const deleteLicense = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Check if license exists
    const license = await tx.license.findUnique({ where: { id } });
    await NotFound(license, "License");

    // 2. Delete SaveTests
    await tx.saveTest.deleteMany({
      where: { licenseId: id },
    });

    // 3. Delete Plans
    await tx.plan.deleteMany({
      where: { licenseId: id },
    });

    // 4. Delete Topics and related data
    const topics = await tx.topic.findMany({
      where: { licenseIds: { has: id } },
    });

    for (const topic of topics) {
      // Delete TestResults for the topic
      await tx.testResult.deleteMany({
        where: { topicId: topic.id },
      });

      // Find all Tests under this topic
      const tests = await tx.test.findMany({
        where: { topicId: topic.id },
      });

      for (const test of tests) {
        // Delete TestQuestions
        await tx.testQuestion.deleteMany({ where: { testId: test.id } });

        // Delete Bookmarks under this test
        await tx.bookmark.deleteMany({ where: { testId: test.id } });

        // Delete TestResults linked to this test (double check)
        await tx.testResult.deleteMany({ where: { testId: test.id } });
      }

      // Delete Tests under the topic
      await tx.test.deleteMany({ where: { topicId: topic.id } });

      // Delete SaveTests under this topic
      await tx.saveTest.deleteMany({ where: { topicId: topic.id } });

      // Get all questions in the topic
      const questions = await tx.question.findMany({
        where: { topicId: topic.id },
      });

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

      await tx.question.deleteMany({ where: { topicId: topic.id } });

      await tx.topic.delete({ where: { id: topic.id } });
    }

    // 5. Delete Tests (if any not covered above)
    const remainingTests = await tx.test.findMany({ where: { licenseId: id } });

    for (const test of remainingTests) {
      await tx.testQuestion.deleteMany({ where: { testId: test.id } });
      await tx.bookmark.deleteMany({ where: { testId: test.id } });
      await tx.testResult.deleteMany({ where: { testId: test.id } });
    }

    await tx.test.deleteMany({ where: { licenseId: id } });

    // 6. Finally, delete the license
    return await tx.license.delete({ where: { id } });
  });
};

export const LicenseService = {
    createLicense,
    getAllLicense,
    getSingleLicense,
    deleteLicense,
    updateLicense
}