import { PrismaQueryBuilder } from "../../builder/QueryBuilder";
import { prisma } from "../../prisma/client";
import { IBooking } from "./booking.interface";


const createBooking = async (payload: IBooking) : Promise<IBooking | null> => {
  return await prisma.booking.create({
    data: payload,
  });
};



// get booking by booking id
const getBookingById = async (bookingId: string) => {

    return await prisma.booking.findUnique({
        where: {
            id: bookingId
        },
        include: {
            service: true,
            staf: true,
            customer: true
        }
    });
}

// get all booking 
const getAllBooking = async () => {
  return await prisma.booking.findMany({})
};


// get all booking by staf id
const getAllBookingByStafId = async (stafId: string) => {
    return await prisma.booking.findMany({
        where: {
            stafId: stafId
        },
        include: {
            service: true,
            staf: true,
            customer: true
        }
    });
}
// get all booking by customer id      
const getAllBookingByCustomerId = async (customerId: string) => {
    return await prisma.booking.findMany({
        where: {
            customerId: customerId
        },
        include: {
            service: true,
            staf: true,
            customer: true
        }
    });
}
// get all booking by service id
const getAllBookingByServiceId = async (serviceId: string) => {
    return await prisma.booking.findMany({
        where: {
            serviceId: serviceId
        },
        include: {
            service: true,
            staf: true,
            customer: true
        }
    });
}

//Update booking by booking id
const updateBookingById = async (bookingId: string, payload: Partial<IBooking>) => {
    return await prisma.booking.update({
        where: {
            id: bookingId
        },
        data: payload
    });
}


//get booking by confirm status
const getAllConfirmedBooking=async()=>{
    const result= await prisma.booking.findMany({
        where:{
            status:'confirmed'
        }
    })
    const total= await prisma.booking.count({
        where:{
            status:'confirmed'
        }
    })
    return {
        result,
        total
    }
}
//get booking by cancelled status
const getAllCancelledBooking=async()=>{
    const result= await prisma.booking.findMany({
        where:{
            status:'cancelled'
        }
    })
    const total= await prisma.booking.count({
        where:{
            status:'cancelled'
        }
    })
    return {
        result,
        total
    }
}
//get booking by completed status
const getAllCompletedBooking=async()=>{
    const result= await prisma.booking.findMany({
        where:{
            status:'completed'
        }
    })
    const total= await prisma.booking.count({
        where:{
            status:'completed'
        }
    })
    return {
        result,
        total
    }
}

//latest booking
const latestBooking=async()=>{
    return await prisma.booking.findMany({
        orderBy:{
            createdAt:'desc'
        },
        take:10,
        include:{
            service:{
                select:{
                    service:true
                }
            }
        }
    })
}


//booking by shopId
const getAllBookingByShopId = async (shopId: string) => {
    return await prisma.booking.findMany({
        where: {
            service: {
                shopId: shopId
            },
            
        },
        select: {
            day:true,
            time:true,
            status:true,
            service: {
                select: {
                    service: true,
                }
            },
            customer: {
                select: {
                    name: true,
                    email: true,
                }
            }
        },

    });
}
export const BookingService = { createBooking ,
    getAllBookingByCustomerId,
    getAllBookingByStafId,
    getAllBookingByServiceId,
    getBookingById,
    getAllBooking,
    updateBookingById,
    getAllConfirmedBooking,
    getAllCancelledBooking,
    getAllCompletedBooking,
    latestBooking,
    getAllBookingByShopId


};