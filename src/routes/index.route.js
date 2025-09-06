import express from "express";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js"
import clientRoutes from "./client.routes.js"
import reportRoutes from "./report.routes.js";
import transactionRoutes from "./transaction.routes.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/client", authMiddleware, clientRoutes);
router.use("/product", authMiddleware.productRoutes);
router.use("/report", authMiddleware, reportRoutes);
router.use("/transaction",authMiddleware, transactionRoutes);

export default router;
