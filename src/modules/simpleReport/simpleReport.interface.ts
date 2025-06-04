
export interface ISimpleReport  {
    id?: string;
    servicePlanId: string;
    userId : string;
    scanType: string;
    appointmentDate: Date;
    status: string;
    notes: string;
    message: string;
    createdAt?: Date;
    updatedAt?: Date;
}



