import { read_merchant, read_merchant_by_email, write_merchant } from "./crud.js";
import crypto from 'crypto'

export const create_merchant = async (req, res) => {
    try {
        let { name, email } = req.body
        let return_object = {
            name, email
        }

        let is_merchant_existing = await read_merchant_by_email(email)
        if(is_merchant_existing) return_object.merchant_id = is_merchant_existing.merchant_id
        if(!is_merchant_existing) {
            let merchant_id = crypto.randomUUID()
            if(!await write_merchant({name, email, merchant_id }) ) throw new custom_error("Something went wrong", "09")
                return_object.merchant_id = merchant_id
        }

        return res.status(200).json({
            code: 200,
            response_code: "00",
            status: "success",
            message: "Merchant Created succesfully",
            data: { ...return_object },
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


export const get_merchant = async (req, res) => {
    try {
       
        let merchant = await read_merchant()

        return res.status(200).json({
            code: 200,
            response_code: "00",
            status: "success",
            message: "Merchant Fetched succesfully",
            data: merchant,
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