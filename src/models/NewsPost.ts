import mongoose from "mongoose";

const NewsPostSchema = new mongoose.Schema({
  title: { ar: { type: String, required: true }, en: { type: String, required: true } },
  content: { ar: { type: String, required: true }, en: { type: String, required: true } },
  excerpt: { ar: { type: String, default: "" }, en: { type: String, default: "" } },
  image: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.NewsPost || mongoose.model("NewsPost", NewsPostSchema);
