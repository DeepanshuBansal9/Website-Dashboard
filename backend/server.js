import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cron from "node-cron";
import cors from "cors";
import websiteRoutes from "./routes/websiteRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/websites", websiteRoutes);

// Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
