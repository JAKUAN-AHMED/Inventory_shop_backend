
import { prisma } from "../../prisma/client";
import { ISimpleReport } from "./simpleReport.interface";
import { ScanType, Status } from "@prisma/client"; // Import ScanType and Status enums

const createSimpeReport = async (
  payload: ISimpleReport 
): Promise<ISimpleReport | null> => {
  return await prisma.simpleReport.create({
    data: {
      ...payload,
        scanType: payload.scanType as ScanType, 
        status: payload.status as Status,
    },
  });
};


const getSimpleReportById = async (query: any): Promise<ISimpleReport | null> => {
    console.log(query);
     return await prisma.simpleReport.findUnique({
        where:{
           id: query
        }
     })
}


export const  simpleReportService = {
    createSimpeReport,
    getSimpleReportById
};
