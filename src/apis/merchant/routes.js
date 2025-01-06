import express from "express";
import {
    create_merchant_middleware
} from "./middleware.js";
import {
    create_merchant, get_merchant
} from "./controller.js";

const router = express.Router();

router.get("/", get_merchant)

router.post("/", create_merchant_middleware, create_merchant)

export default router;



