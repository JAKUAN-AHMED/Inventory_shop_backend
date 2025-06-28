import QueryBuilder from "../../builder/QueryBuilder";
import { prisma } from "../../prisma/client"

const getAllPayments = async (userId: string, role: string,query:any) => {
    if (role !== "ADMIN") {
        // const result=await prisma.subscription.findMany({
        //     where:{
        //         userId
        //     },
        //     orderBy: {
        //         createdAt: 'desc'
        //     },
        //     include: {
        //         payments: true
        //     }
        // })

       const builder = new QueryBuilder(query, prisma.subscription);
       const result=await builder
        .sort(['-createdAt'])
       .paginate()
        .include({
            payments: true
        })
        .execute();

        const meta=await builder.countTotal();
        return {
            result,
            meta
        };
    }
    return await prisma.payment.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            subscription: true
        }
    })
}

const singlePayment=async(userId:string,paymentId:string,role:string)=>{
    if(role!=="ADMIN")
    {
        return await prisma.subscription.findUnique({
            where:{
                userId
            },
            include:{
                payments:true
            }
        })
    }
}