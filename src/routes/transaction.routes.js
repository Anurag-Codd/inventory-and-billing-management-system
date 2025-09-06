import express from "express";
import { genarateSaleOrPurchase } from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/create", genarateSaleOrPurchase);

export default router;
