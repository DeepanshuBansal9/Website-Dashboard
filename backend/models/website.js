import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema(
  {
    name: String,
    url: String,
    status: { type: String, default: "unknown" },
    responseTime: { type: Number, default: null },
    lastChecked: { type: Date, default: null },
    sslValid: { type: Boolean, default: false },
  sslExpiry: { type: Date, default: null },
  },
  { timestamps: true } // adds createdAt, updatedAt
);

export default mongoose.model("Website", websiteSchema);
