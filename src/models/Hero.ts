import mongoose from "mongoose";

const HeroSchema = new mongoose.Schema({
  title: { ar: { type: String, required: true }, en: { type: String, required: true } },
  subtitle: { ar: { type: String, required: true }, en: { type: String, required: true } },
  backgroundImage: { type: String, default: "" },
  backgroundVideo: { type: String, default: "" },
  backgroundType: { type: String, enum: ["image", "video"], default: "image" },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Hero || mongoose.model("Hero", HeroSchema);
