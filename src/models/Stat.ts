import mongoose from "mongoose";

const StatSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Number, required: true },
  label: { ar: { type: String, required: true }, en: { type: String, required: true } },
  icon: { type: String, default: "BarChart" },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Stat || mongoose.model("Stat", StatSchema);
