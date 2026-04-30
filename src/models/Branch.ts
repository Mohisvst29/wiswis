import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema({
  name: { ar: { type: String, required: true }, en: { type: String, required: true } },
  city: { ar: { type: String, required: true }, en: { type: String, required: true } },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Branch || mongoose.model("Branch", BranchSchema);
