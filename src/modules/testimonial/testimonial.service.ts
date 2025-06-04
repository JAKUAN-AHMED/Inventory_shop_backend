import { prisma } from "../../prisma/client";
import { ITestimonial } from "./testimonial.interface";


const createTestimonial = async (data: ITestimonial) : Promise< ITestimonial | null > => {
    return await prisma.testimonial.create({
        data: {
        ...data,
        },
    });
};


const getAllTestimonial = async () : Promise<ITestimonial[] | null > =>  {
    return await prisma.testimonial.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
};


export const testimonialService = { 
    createTestimonial,
    getAllTestimonial
};

