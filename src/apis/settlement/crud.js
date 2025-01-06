import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        },
    },
});
let transaction_timeout = 180000

export async function write_merchant_virtual_account_settlement(merchant_id, data, prisma) {
    try {

        let transaction

        transaction = await prisma.virtual_account_transaction.create({
            data: {
                reference: data.reference,
                amount: Number(data.value),
                description: data.description,
                fee: data.fee,
                currency: data.currency,
                account_name: data.account_name,
                account_number: data.account_number,
                bank_code: data.bank_code,
                merchant_id: merchant_id
            }

        })

        if (!transaction) return false

        return transaction

    }
    catch (err) {
        console.log("Error while trying to write_merchant_virtual_account_settlement: " + err)
        return false
    } finally {
    }
}

export async function read_merchant_virtual_account_settlement_by_reference(merchant_id, reference) {
    try {

        let transaction = await prisma.virtual_account_transaction.findFirst({
            where: {
                merchant_id,
                reference
            }
        })

        if (!transaction) return false

        return transaction

    }
    catch (err) {
        console.log("Error while trying to read_merchant_virtual_account_settlement_by_reference: " + err)
        return false
    } finally {
        await prisma.$disconnect();
    }
}

export async function write_merchant_card_settlement(merchant_id, data, prisma) {
    try {

        let transaction = await prisma.card_transaction.create({
            data: {
                reference: data.reference,
                amount: Number(data.value),
                description: data.description,
                fee: data.fee,
                currency: data.currency,
                card_last_4: data.card_number,
                card_holder_name: data.card_holder_name,
                card_expiration_date: data.card_expiration_date,
                card_verification_code: data.card_verification_code,
                merchant_id: merchant_id
            }
        })


        if (!transaction) return false

        return true

    }
    catch (err) {
        console.log("Error while trying to write_merchant_virtual_account_settlement: " + err)
        return false
    } finally {
    }
}

export async function update_merchant_card_settlement(where, data, prisma) {
    try {

        let transaction = await prisma.card_transaction.update({
            where,
            data
        })

        if (!transaction) return false
        return transaction

    }
    catch (err) {
        console.log("Error while trying to update_merchant_card_settlement: " + err)
        return false
    } finally {
    }
}


export async function read_merchant_card_transaction(where) {
    try {

        let transaction = await prisma.card_transaction.findFirst({
            where
        })

        if (!transaction) return false

        return transaction

    }
    catch (err) {
        console.log("Error while trying to read_merchant_card_transaction: " + err)
        return false
    } finally {
        await prisma.$disconnect();
    }
}


export async function read_total_settled(merchant_id) {
    try {

        const total_card_payment = await prisma.card_transaction.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                merchant_id,
                status: 'success'
            }
        })

        const total_card_payment_fee = await prisma.card_transaction.aggregate({
            _sum: {
                fee: true,
            },
            where: {
                merchant_id,
                status: 'success'
            }
        })

        let total_merchant_card_payment = (Number(total_card_payment._sum.amount || 0.00) -  Number(total_card_payment_fee._sum.fee || 0.00)) || 0

        const total_virtual_account_payment = await prisma.virtual_account_transaction.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                merchant_id,
                status: 'success'
            }
        })

        const total_virtaul_account_payment_fee = await prisma.virtual_account_transaction.aggregate({
            _sum: {
                fee: true,
            },
            where: {
                merchant_id,
                status: 'success'
            }
        })

        let total_merchant_virtual_account_payment = (Number(total_virtual_account_payment._sum.amount || 0.00) -  Number(total_virtaul_account_payment_fee._sum.fee || 0.00)) || 0

        return Number(total_merchant_card_payment)+ Number(total_merchant_virtual_account_payment)

    }
    catch (err) {
        console.log("Error while trying to read_total_settled: " + err)
        return false
    } finally {
    }
}



export async function read_total_pending(merchant_id) {
    try {

        const total_card_payment = await prisma.card_transaction.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                merchant_id,
                status: 'pending'
            }
        })

        const total_card_payment_fee = await prisma.card_transaction.aggregate({
            _sum: {
                fee: true,
            },
            where: {
                merchant_id,
                status: 'pending'
            }
        })

        let total_merchant_card_payment = (Number(total_card_payment._sum.amount || 0.00) -  Number(total_card_payment_fee._sum.fee || 0.00)) || 0

        const total_virtual_account_payment = await prisma.virtual_account_transaction.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                merchant_id,
                status: 'pending'
            }
        })

        const total_virtaul_account_payment_fee = await prisma.virtual_account_transaction.aggregate({
            _sum: {
                fee: true,
            },
            where: {
                merchant_id,
                status: 'pending'
            }
        })

        let total_merchant_virtual_account_payment = (Number(total_virtual_account_payment._sum.amount || 0.00) -  Number(total_virtaul_account_payment_fee._sum.fee || 0.00)) || 0

        return Number(total_merchant_card_payment)+ Number(total_merchant_virtual_account_payment)

    }
    catch (err) {
        console.log("Error while trying to read_total_pending: " + err)
        return false
    } finally {
    }
}