import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  title: { ar: { type: String, required: true }, en: { type: String, required: true } },
  description: { ar: { type: String, required: true }, en: { type: String, required: true } },
  image: { type: String, default: "" },
  icon: { type: String, default: "Fuel" },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);
