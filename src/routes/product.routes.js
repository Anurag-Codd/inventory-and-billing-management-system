import express from "express";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  searchQuery,
  stockTracking,
  updateProduct,
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("/", fetchProducts);
router.get("/search", searchQuery);
router.post("/track", stockTracking);
router.post("/create", createProduct);
router.patch("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
