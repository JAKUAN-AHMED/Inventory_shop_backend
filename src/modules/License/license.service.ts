import { License } from "@prisma/client";
import { prisma } from "../../prisma/client"
import { NotFound } from "../../utils/utility";
import QueryBuilder from "../../builder/QueryBuilder";




//create
const createLicense = async (payload: License & { topicIds: string[] }) => {
    const { topicIds, ...licenseData } = payload;
    // 1. Create the topic
    const result = await prisma.license.create({
        data: licenseData
    });

    // 2. Create many-to-many relations
    if (topicIds && topicIds.length > 0) {
        const relations = topicIds.map((topicId: string) => ({
            topicId,
            licenseId: result.id
        }));

        await prisma.licenseTopic.createMany({ data: relations });
    }

    return result;
}

//get all
const getAllLicense = async (query: any) => {
    const builder = new QueryBuilder(query, prisma.license);

    const result = await builder
        .paginate()
        .include({
            licenseTopics: {
                include: {
                    topic: true,
                },
            },
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
            licenseTopics: {
                include: {
                    topic: true,
                    license: true
                }
            }
        }
    })
}


//update license
const updateLicense = async (
  id: string,
  payload: Partial<License> & { topicIds: string[] }
) => {
  const { topicIds, ...licenseData } = payload;

  // 1. Check if license exists
  const licenseExists = await prisma.license.findUnique({
    where: { id },
  });
  await NotFound(licenseExists, "License");

  // 2. Add only new topic relations
  if (topicIds && topicIds.length > 0) {
    // Get existing topicIds already related to the license
    const existingRelations = await prisma.licenseTopic.findMany({
      where: { licenseId: id },
      select: { topicId: true },
    });

    const existingTopicIds = new Set(existingRelations.map((rel) => rel.topicId));

    // Filter topicIds that are not yet related
    const newRelations = topicIds
      .filter((topicId) => !existingTopicIds.has(topicId))
      .map((topicId) => ({
        licenseId: id,
        topicId,
      }));

    // Only create new ones
    if (newRelations.length > 0) {
      await prisma.licenseTopic.createMany({ data: newRelations });
    }
  }

  // 3. Update the license data
  return await prisma.license.update({
    where: { id },
    data: licenseData,
  });
};



//delete single

const deleteLicense = async (id: string) => {
    /**
     * first  delete licence id from licenseTopic
     * delete licence from license collection
     */
    // check if license exists
    const licenseExists = await prisma.license.findUnique({
        where: {
            id
        }
    });
    await NotFound(licenseExists, "License");


    // find the license topics associated with the license and remove the license id
    const licenseTopics = await prisma.licenseTopic.findMany({
        where: {
            licenseId: id
        }
    });

    if (licenseTopics.length > 0) {
        // delete the license topics
        await prisma.licenseTopic.deleteMany({
            where: {
                licenseId: id
            }
        });
    }

    //now delete the license safely
    return await prisma.license.delete({
        where: {
            id
        }
    })


}

export const LicenseService = {
    createLicense,
    getAllLicense,
    getSingleLicense,
    deleteLicense,
    updateLicense
}