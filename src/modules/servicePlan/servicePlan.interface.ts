

export interface IServicePlan {
    id?: string;
    pacakagesName: string;
    timeApprox: string;
    cost: number;
    duration: number;
    coverage: string[];
    createdAt?: Date;
    updatedAt?: Date;
}



//     model ServicePlan {
//   id                 String   @id @default(auto()) @map("_id") @db.ObjectId
//   pacakagesName      String
//   timeApprox         String
//   cost               Float
//   duration           Int
//   coverage           String[]
//   createdAt          DateTime @default(now())
//   updatedAt          DateTime @updatedAt 

//   bookings           Booking[]
//   SimpleReport       SimpleReport[]    

//   @@map("ServicesPlan")
// }