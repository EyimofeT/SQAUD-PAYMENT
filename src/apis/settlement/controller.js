import { calculate_fee, calculate_settlement_amount } from "./utils.js";
import { update_merchant } from "../merchant/crud.js";
import { read_merchant_card_transaction, read_merchant_virtual_account_settlement_by_reference, write_merchant_card_settlement, write_merchant_virtual_account_settlement, update_merchant_card_settlement } from './crud.js';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        },
    },
});
let transaction_timeout = 180000


export const virtual_account_settlement = async (req, res) => {
    try {

        let { merchant_id, value, description, account_name, account_number, bank_code, currency, reference } = req.body;
        let transaction_rate = process.env.VIRTUAL_ACCOUNT_TRANSACTION_RATE
        let fee = calculate_fee(transaction_rate, value)
        let merchant_settlement_amount = calculate_settlement_amount(value, fee)

        let settlement_data = {
            value,
            description,
            account_name,
            account_number,
            bank_code,
            currency,
            reference,
            fee,
            merchant_settlement_amount
        }

        if (!await read_merchant_virtual_account_settlement_by_reference(merchant_id, reference)) {
            try {
                await prisma.$transaction(async (prisma) => {
                    if (!await write_merchant_virtual_account_settlement(merchant_id, settlement_data, prisma)) throw new custom_error("Something went wrong", "09")

                    const merchant_update_data = {
                        balance: {
                            increment: merchant_settlement_amount
                        }
                    }
                    if (!await update_merchant(merchant_id, merchant_update_data, prisma)) throw new custom_error("Something went wrong", "09")

                }, { timeout: transaction_timeout });
            }
            catch (err) {
                console.log(err)
                throw new custom_error("Something went wrong", "09")
            }

        }

        return res.status(200).json({
            code: 200,
            response_code: "00",
            status: "success",
            message: "Transaction processed succesfully",
            data: { ...settlement_data },
        });
    } catch (err) {
        return res.status(400).json({
            code: 400,
            response_code: err.code,
            status: "failed",
            message: err.message,
            error: "An Error Occured!",
        });
    } finally {

    }
}

export const create_card_settlement = async (req, res) => {
    try {

        let { merchant_id, value, description, card_number, card_holder_name, card_expiration_date, card_verification_code, currency, reference } = req.body;
        let transaction_rate = process.env.CARD_TRANSACTION_RATE
        let fee = calculate_fee(transaction_rate, value)
        let merchant_settlement_amount = calculate_settlement_amount(value, fee)

        let settlement_data = {
            value,
            description,
            card_number: card_number.slice(-4),
            card_holder_name,
            card_expiration_date,
            card_verification_code,
            currency,
            reference,
            fee,
            merchant_settlement_amount
        }

        if (!await read_merchant_card_transaction({ merchant_id, reference })) {

            try {
                const save_data = await prisma.$transaction(async (prisma) => {
                    if (!await write_merchant_card_settlement(merchant_id, settlement_data, prisma)) throw new custom_error("Something went wrong", "09")
                }, { timeout: transaction_timeout });
            }
            catch (err) {
                console.log(err)
                throw new custom_error("Something went wrong", "09")
            }
        }

        return res.status(200).json({
            code: 200,
            response_code: "00",
            status: "success",
            message: "Transaction processed succesfully",
            data: { ...settlement_data },
        });
    } catch (err) {
        return res.status(400).json({
            code: 400,
            response_code: err.code,
            status: "failed",
            message: err.message,
            error: "An Error Occured!",
        });
    } finally {

    }
}

export const update_card_settlement = async (req, res) => {
    try {

        let { value, card_number, currency, reference, transaction } = req.body;

        let merchant_settlement_amount = Number(transaction.amount) - Number(transaction.fee)

        let settlement_data = {
            ...req.body
        }

        if (transaction.status == 'pending') {
            try {
                await prisma.$transaction(async (prisma) => {

                    const where = {
                        merchant_id: transaction.merchant_id,
                        reference: transaction.reference
                    }
                    const data = {
                        status: 'success'
                    }

                    if (!await update_merchant_card_settlement(where, data, prisma)) throw new custom_error("Something went wrong", "09")

                    const merchant_update_data = {
                        balance: {
                            increment: merchant_settlement_amount
                        }
                    }

                    if (!await update_merchant(transaction.merchant_id, merchant_update_data, prisma)) throw new custom_error("Something went wrong", "09")

                    transaction.status = 'success'
                    transaction.updated_at = new Date()
                }, { timeout: transaction_timeout });
            }
            catch (err) {
                console.log(err)
                throw new custom_error("Something went wrong", "09")
            }
        }


        return res.status(200).json({
            code: 200,
            response_code: "00",
            status: "success",
            message: "Transaction settled succesfully",
            data: { ...settlement_data },
        });
    } catch (err) {
        return res.status(400).json({
            code: 400,
            response_code: err.code,
            status: "failed",
            message: err.message,
            error: "An Error Occured!",
        });
    } finally {

    }
}
