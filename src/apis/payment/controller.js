import { PrismaClient } from "@prisma/client";
import { create_merchant_payout, read_total_payout } from "./crud.js";
import { update_merchant } from "../merchant/crud.js";
import { read_total_pending, read_total_settled } from "../settlement/crud.js";
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        },
    },
});
let transaction_timeout = 180000



export const payout = async (req, res) => {
    try {

        let { merchant_id, amount, merchant } = req.body;
        let payout

        try {
            const save_data = await prisma.$transaction(async (prisma) => {

                let payout_data = {
                    status: 'success',
                    amount
                }
                if (!await create_merchant_payout(merchant_id, payout_data, prisma)) throw new custom_error("Something went wrong", "09")

                const merchant_update_data = {
                    balance: {
                        decrement: Number(amount)
                    }
                }

                if (!await update_merchant(merchant_id, merchant_update_data, prisma)) throw new custom_error("Something went wrong", "09")


            }, { timeout: transaction_timeout });
        } catch (err) {
            console.log(err)
            throw new custom_error("Something went wrong", "09")
        }


        merchant.balance -= Number(amount)
        merchant.updated_at = new Date()

        return res.status(200).json({
            code: 200,
            response_code: "00",
            status: "success",
            message: "Payout processed succesfully",
            data: { ...merchant, payout },
        });
    } catch (err) {
        return res.status(200).json({
            code: 400,
            response_code: err.code,
            status: "failed",
            message: err.message,
            error: "An Error Occured!",
        });
    } finally {

    }
}

export const view_merchant_payment = async (req, res) => {
    try {

        let { merchant_id } = req.query
        let { merchant } = req.body;

        let total_settled, total_pending, total_payout

        total_settled = await read_total_settled(merchant_id)
        total_pending = await read_total_pending(merchant_id)
        total_payout = await read_total_payout(merchant_id)



        return res.status(200).json({
            code: 200,
            response_code: "00",
            status: "success",
            message: "Payment data fetched succesfully",
            data: { merchant, available: total_settled - total_payout, completed_settlement: total_settled, pending_settlement: total_pending, total_payout },
        });
    } catch (err) {
        return res.status(200).json({
            code: 400,
            response_code: err.code,
            status: "failed",
            message: err.message,
            error: "An Error Occured!",
        });
    } finally {

    }
}
