
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { prisma } from "../../prisma/client";

export const anaylyticsData = async () => {
  const now = new Date();

  // 1. Total Paid Students
  const paidStudents = await prisma.subscription.count({
    where: {
      isActive: true,
      subscriptionStatus: "PAID",
    },
  });

  // 2. Total Earnings
  const totalEg = await prisma.payment.aggregate({
    where: { status: "SUCCEEDED" },
    _sum: { amount: true },
  });
  const totalEarning = totalEg._sum.amount || 0;

  // 3. Total Licenses
  const totalLs = await prisma.license.count();

  // 4. Total Questions
  const totalQs = await prisma.question.count();

  // 5. Unpaid Student Count
  const totalUnpaidStudentCount = await prisma.user.count({
    where: {
      subscriptions: {
        none: { subscriptionStatus: "PAID" },
      },
    },
  });

  // === MONTHLY EARNING (30 days) ===
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const monthlyPayments = await prisma.payment.findMany({
    where: {
      status: "SUCCEEDED",
      createdAt: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    select: {
      amount: true,
      createdAt: true,
    },
  });

  const monthlyMap: Record<number, number> = {};
  monthlyPayments.forEach((p) => {
    const day = p.createdAt.getDate();
    monthlyMap[day] = (monthlyMap[day] || 0) + p.amount;
  });

  const totalMonthly = Object.values(monthlyMap).reduce((a, b) => a + b, 0);

  const monthlyBreakdown = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const amount = monthlyMap[day] || 0;
    const percentage = ((amount / (totalMonthly || 1)) * 100).toFixed(2);
    return { day, amount, percentage };
  });

  // === WEEKLY EARNING (7 days: Mon–Sun) ===
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const weeklyPayments = await prisma.payment.findMany({
    where: {
      status: "SUCCEEDED",
      createdAt: {
        gte: weekStart,
        lte: weekEnd,
      },
    },
    select: {
      amount: true,
      createdAt: true,
    },
  });

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyMap: Record<string, number> = {};
  weeklyPayments.forEach((p) => {
    const day = p.createdAt.toLocaleDateString("en-US", {
      weekday: "short",
    });
    weeklyMap[day] = (weeklyMap[day] || 0) + p.amount;
  });

  const totalWeekly = Object.values(weeklyMap).reduce((a, b) => a + b, 0);
  const weeklyBreakdown = dayNames.map((day) => {
    const amount = weeklyMap[day] || 0;
    const percentage = ((amount / (totalWeekly || 1)) * 100).toFixed(2);
    return { day, amount, percentage };
  });

  // === YEARLY EARNING (12 months) ===
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEnd = new Date(now.getFullYear(), 11, 31);

  const yearlyPayments = await prisma.payment.findMany({
    where: {
      status: "SUCCEEDED",
      createdAt: {
        gte: yearStart,
        lte: yearEnd,
      },
    },
    select: {
      amount: true,
      createdAt: true,
    },
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const yearlyMap: Record<number, number> = {};
  yearlyPayments.forEach((p) => {
    const month = p.createdAt.getMonth(); // 0–11
    yearlyMap[month] = (yearlyMap[month] || 0) + p.amount;
  });

  const totalYearly = Object.values(yearlyMap).reduce((a, b) => a + b, 0);
  const yearlyBreakdown = monthNames.map((monthName, i) => {
    const amount = yearlyMap[i] || 0;
    const percentage = ((amount / (totalYearly || 1)) * 100).toFixed(2);
    return { month: monthName, amount, percentage };
  });

  return {
    paidStudents,
    totalEarning,
    totalLs,
    totalQs,
    totalUnpaidStudentCount,
    earnings: {
      monthlyBreakdown,
      weeklyBreakdown,
      yearlyBreakdown,
    },
  };
};


//last recent payments with paginations

const lastRecentPayment=async()=>{
    const result=await prisma.payment.findMany({
        select:{
            id:true,
            invoiceNumber:true,
            subscriptionId:true,
            subscription:{
                select:{
                    user:{
                        select:{
                            name:true,
                            email:true,
                            profileImage:true
                        }
                    }
                }
            }
        },
        orderBy:{
            createdAt:'desc'
        },
        take:10
    })
    return result;
}




//every user test results
const EveryUserTestResult=async()=>{
    const testR=await prisma.testResult.findMany({
        select:{
            id:true,
            percentage:true,
            score:true,
            createdAt:true,
            updatedAt:true,
            test:{
              select:{
                license:{
                  select:{
                    name:true
                  }
                }
              }
            },
            user:{
              select:{
                name:true,
                profileImage:true,
              }
            }
        }
    })
    return testR;
}
export const AdminDASHService={
        anaylyticsData,
        lastRecentPayment,
        EveryUserTestResult
}