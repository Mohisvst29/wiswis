import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
  title: { ar: { type: String, required: true }, en: { type: String, required: true } },
  description: { ar: { type: String, required: true }, en: { type: String, required: true } },
  image: { type: String, default: "" },
  yearsOfExperience: { type: Number, default: 10 },
}, { timestamps: true });

export default mongoose.models.About || mongoose.model("About", AboutSchema);
