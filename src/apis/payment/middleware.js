import { read_merchant_by_id } from "../merchant/crud.js";

export const view_merchant_payment_middleware = async (req, res, next) => {
    try {

        let { merchant_id } = req.query;
        if (merchant_id == null || merchant_id == undefined) throw new custom_error("merchant_id required", "02")

        let merchant = await read_merchant_by_id(merchant_id)
        if (!merchant) throw new custom_error("Invalid merchant", "08")

        req.body.merchant = merchant
        next();
    }
    catch (err) {
        return res.status(200).json({
            code: 400,
            response_code: err.code,
            status: "failed",
            message: err.message,
            error: "An Error Occured!",
        });
    };
}


export const payout_middleware = async (req, res, next) => {
    try {

        let { merchant_id, amount } = req.body;
        if (!merchant_id) throw new custom_error("merchant_id required", "02")
        if (!amount) throw new custom_error("amount required", "02")
        if (amount < 1 || isNaN(Number(amount))) throw new custom_error(`Invalid amount`, "04");

        const merchant = await read_merchant_by_id(merchant_id)
        if (!merchant) throw new custom_error("Invalid merchant", "08")

        if (Number(merchant.balance) < Number(amount)) throw new custom_error("Insufficient funds", "05")
        req.body.merchant = merchant

        next();
    }
    catch (err) {
        return res.status(200).json({
            code: 400,
            response_code: err.code,
            status: "failed",
            message: err.message,
            error: "An Error Occured!",
        });
    };
}