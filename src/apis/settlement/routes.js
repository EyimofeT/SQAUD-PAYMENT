import express from "express";
import {
    virtual_account_settlement_middleware, create_card_settlement_middleware, update_card_settlement_middleware
} from "./middleware.js";
import {
    virtual_account_settlement, create_card_settlement, update_card_settlement
} from "./controller.js";

const router = express.Router();

// all routes in here are starting with  v1/settlement/

router.post("/transaction/card",create_card_settlement_middleware, create_card_settlement)
router.patch("/transaction/card",update_card_settlement_middleware, update_card_settlement)

router.post("/transaction/virtualaccount",virtual_account_settlement_middleware, virtual_account_settlement)

export default router;



