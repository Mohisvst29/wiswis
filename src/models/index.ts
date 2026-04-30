import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  titleEn: { type: String, required: true },
  titleAr: { type: String, required: true },
  descriptionEn: { type: String, required: true },
  descriptionAr: { type: String, required: true },
  imageUrl: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const BranchSchema = new mongoose.Schema({
  nameEn: { type: String, required: true },
  nameAr: { type: String, required: true },
  descEn: { type: String, required: true },
  descAr: { type: String, required: true },
  cityEn: { type: String, required: true },
  cityAr: { type: String, required: true },
  mapUrl: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const NewsSchema = new mongoose.Schema({
  titleEn: { type: String, required: true },
  titleAr: { type: String, required: true },
  descriptionEn: { type: String, required: true },
  descriptionAr: { type: String, required: true },
  imageUrl: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

const SettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

export const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
export const Branch = mongoose.models.Branch || mongoose.model('Branch', BranchSchema);
export const News = mongoose.models.News || mongoose.model('News', NewsSchema);
export const Partner = mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
export const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
export const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
