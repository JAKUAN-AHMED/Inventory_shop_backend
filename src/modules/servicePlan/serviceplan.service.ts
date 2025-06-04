import { prisma } from "../../prisma/client";
import { IServicePlan } from "./servicePlan.interface";



const createServicePlan = async (servicePlan: IServicePlan): Promise<IServicePlan | null > => {


     const result = await prisma.servicePlan.create({
        data: {
             ...servicePlan
        }
     });

     return result;
};

const getAllServicePlan = async (query: any): Promise<IServicePlan[] | null> => {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const take = parseInt(limit);
    const result = await prisma.servicePlan.findMany({
        skip,
        take,
        orderBy: {
            createdAt: 'desc',
        },
    }); 

    return result;

}

const getSingleServicePlan = async (id: string): Promise<IServicePlan | null> => {
    console.log(id);

    const result = await prisma.servicePlan.findUnique({
        where: {
            id,
        },
    });

    return result;
};


export const servicePlanService = { 
    createServicePlan,
    getAllServicePlan,
    getSingleServicePlan,
};


