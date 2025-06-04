

export interface IBooking {
    id?: string;
    servicePlanId: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    serviceName: string;
    scheduleAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
