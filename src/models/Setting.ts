import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({
  siteName: { ar: String, en: String },
  logo: { type: String, default: "" },
  logoSize: { type: Number, default: 120 },
  primaryColor: { type: String, default: "#8B0000" },
  secondaryColor: { type: String, default: "#FF6B00" },
  fontArabic: { type: String, default: "Cairo" },
  fontEnglish: { type: String, default: "Inter" },
  heroBackground: { type: String, default: "" },
  heroBackgroundType: { type: String, enum: ["image", "video"], default: "image" },
  phones: [{ type: String }],
  email: { type: String, default: "" },
  address: { ar: String, en: String },
  socialLinks: {
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    youtube: { type: String, default: "" },
    snapchat: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
  },
  mapLatitude: { type: Number, default: 24.7136 },
  mapLongitude: { type: Number, default: 46.6753 },
}, { timestamps: true });

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
