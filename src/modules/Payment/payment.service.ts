import QueryBuilder from "../../builder/QueryBuilder";
import { prisma } from "../../prisma/client"

const getAllPayments = async (userId: string, role: string, query: any) => {
    if (role !== "ADMIN") {

        const builder = new QueryBuilder(query, prisma.subscription);
        const result = await builder
            .rawFilter({
                userId
            })
            .sort(['-createdAt'])
            .paginate()
            .include({
                payments:true
            })
            .execute();

        const meta = await builder.countTotal();
        return {
            result,
            meta
        };
    }
    const builder = new QueryBuilder(query, prisma.subscription);
    const result = await builder
        .sort(['-createdAt'])
        .paginate()
        .include({
            payments: true
        })
        .execute();

    const meta = await builder.countTotal();
    return {
        result,
        meta
    };
}

const singlePayment = async (userId: string, paymentId: string, role: string) => {
    if (role !== "ADMIN") {
        return await prisma.subscription.findUnique({
            where: {
                userId
            },
            include: {
                plan:{ 
                    select:{
                        license:{
                            select:{
                                name:true
                            }
                        }
                    }
                },
                payments: {
                    include:{
                        
                    }
                }
            }
        })
    }
}

export const PaymentService={
    getAllPayments,
    singlePayment
}