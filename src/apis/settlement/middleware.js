import { read_merchant_by_id } from "../merchant/crud.js";
import {read_merchant_card_transaction }  from "./crud.js";

export const virtual_account_settlement_middleware = async (req, res, next) => {
  try {

    let { merchant_id, value, description, account_name, account_number, bank_code, currency, reference } = req.body;
    if (!merchant_id) throw new custom_error("merchant_id required", "02")
    if (!value) throw new custom_error("value required", "02")
    if (!description) throw new custom_error("description required", "02")
    if (!account_name) throw new custom_error("account_name required", "02")
    if (!account_number) throw new custom_error("account_number required", "02")
    if (!bank_code) throw new custom_error("bank_code required", "02")
    if (!currency) throw new custom_error("currency required", "02")
    if (!reference) throw new custom_error("reference required", "02")

    if (value < 1 || isNaN(Number(value))) throw new custom_error(`Invalid value`, "04");
    if(!await read_merchant_by_id(merchant_id)) throw new custom_error("Invalid merchant", "08")

    next();
  }
  catch (err) {
    return res.status(400).json({
      code: 400,
      response_code: err.code,
      status: "failed",
      message: err.message,
      error: "An Error Occured!",
    });
  };
}


export const create_card_settlement_middleware = async (req, res, next) => {
  try {

    let { merchant_id, value, description, card_number, card_holder_name, card_expiration_date,card_verification_code, currency, reference } = req.body;
    if (!merchant_id) throw new custom_error("merchant_id required", "02")
    if (!value) throw new custom_error("value required", "02")
    if (!description) throw new custom_error("description required", "02")
    if (!card_number) throw new custom_error("card_number required", "02")
    if (!card_holder_name) throw new custom_error("card_holder_name required", "02")
    if (!card_expiration_date) throw new custom_error("card_expiration_date required", "02")
    if (!card_verification_code) throw new custom_error("card_verification_code required", "02")
    if (!currency) throw new custom_error("currency required", "02")
    if (!reference) throw new custom_error("reference required", "02")

    if (value < 1 || isNaN(Number(value))) throw new custom_error(`Invalid value`, "04");
    if(!await read_merchant_by_id(merchant_id)) throw new custom_error("Invalid merchant", "08")


    next();
  }
  catch (err) {
    return res.status(400).json({
      code: 400,
      response_code: err.code,
      status: "failed",
      message: err.message,
      error: "An Error Occured!",
    });
  };
}

export const update_card_settlement_middleware = async (req, res, next) => {
  try {

    let { value, card_number, currency, reference } = req.body;
    if (!value) throw new custom_error("value required", "02")
    if (!card_number) throw new custom_error("card_number required", "02")
    if (!currency) throw new custom_error("currency required", "02")
    if (!reference) throw new custom_error("reference required", "02")

    if (value < 1 || isNaN(Number(value))) throw new custom_error(`Invalid value`, "04");

    let card_transaction_where = {
      reference,
      currency,
      amount : Number(value),
      card_last_4 : card_number.slice(-4)
    }
    let transaction  = await read_merchant_card_transaction(card_transaction_where)
    if(!transaction) throw new custom_error("Unable to find transaction", "07")
    
      req.body.transaction = transaction
    next();
  }
  catch (err) {
    return res.status(400).json({
      code: 400,
      response_code: err.code,
      status: "failed",
      message: err.message,
      error: "An Error Occured!",
    });
  };
}