import express from "express"
import { transactionData, transactionHistory } from "../controllers/report.controller.js"

const router = express.Router()


router.get('/search', transactionData)
router.get('/:id', transactionHistory)

export default router