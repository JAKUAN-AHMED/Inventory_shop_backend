import { prisma } from "../../prisma/client";
import { Ibooking } from "./booking.interface";

const createBooking=async(payload:Ibooking)=>{
    return await prisma.booking.create({
        data:{...payload}
    })
}

const getAllBooking=async()=>{
    return await prisma.booking.findMany()
}

const getSingleBooking=async(bookingId:string)=>{
    return await prisma.booking.findUnique({
        where:{
            id:bookingId
        }
    })
}
export const BookinServices={

    createBooking,
    getAllBooking,
    getSingleBooking
};