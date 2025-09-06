import express from "express";
import {
  ClientQuery,
  createClient,
  deleteClient,
  fetechClients,
  updateClientData,
} from "../controllers/client.controller.js";

const router = express.Router();

router.get("/", fetechClients);
router.get("/search", ClientQuery);
router.post("/create", createClient);
router.patch("/update/:id", updateClientData);
router.delete("/delete/:id", deleteClient);

export default router;
