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