import "dotenv/config";
import cors from "cors";
import express from "express";

import indexRoutes from "./routes/index.route.js";
import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api/v1", indexRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at Port ${PORT}`);
});
