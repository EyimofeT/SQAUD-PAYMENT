import express from "express";
import {
    view_merchant_payment_middleware,payout_middleware
} from "./middleware.js";
import {
    payout, view_merchant_payment
} from "./controller.js";

const router = express.Router();

// all routes in here are starting with  v1/payment/

router.get("/",view_merchant_payment_middleware, view_merchant_payment)

router.post("/payout", payout_middleware, payout)


export default router;



