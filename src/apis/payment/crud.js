import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        },
    },
});
let transaction_timeout = 180000

export async function create_merchant_payout(merchant_id, data,prisma) {
    try {

        let transaction = await prisma.payout.create({
                data: {
                    status: data.status,
                    amount: Number(data.amount),
                    merchant_id: merchant_id
                }
            })

            if(!transaction) return false

            return transaction
    }
    catch (err) {
        console.log("Error while trying to create_merchant_payout: " + err)
        return false
    } finally {
    }
}

export async function read_total_payout(merchant_id) {
    try {

        const total_payout = await prisma.payout.aggregate({
            _sum: {
              amount: true,
            },
            where:{
            merchant_id
            }
          });
        
          return total_payout._sum.amount || 0;
    }
    catch (err) {
        console.log("Error while trying to create_merchant_payout: " + err)
        return false
    } finally {
    }
}