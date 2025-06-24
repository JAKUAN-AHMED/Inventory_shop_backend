import { License } from "@prisma/client";
import { prisma } from "../../prisma/client"
import { NotFound } from "../../utils/utility";



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
const getAllLicense = async () => {
    const result = await prisma.license.findMany({
        include: {
            licenseTopics:{
                include:{
                    topic:true
                }
            }
        },
    });

    return result;
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
                   topic:true,
                   license:true
                }
            }
        }
    })
}


//update license
const updateLicense = async (id: string, payload: Partial<License>) => {

    // check if license exists
    const licenseExists = await prisma.license.findUnique({
        where: {
            id
        }
    });
    await NotFound(licenseExists, "License");

    return await prisma.license.update({
        where: {
            id
        },
        data: payload
    });
}


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