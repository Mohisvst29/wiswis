export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Setting from "@/models/Setting";
import Hero from "@/models/Hero";
import Service from "@/models/Service";
import Stat from "@/models/Stat";
import About from "@/models/About";
import Branch from "@/models/Branch";

export async function POST() {
  try {
    await connectDB();

    // Seed Settings
    const existingSettings = await Setting.findOne();
    if (!existingSettings) {
      await Setting.create({
        siteName: { ar: "ويسويس", en: "Wiswis" },
        primaryColor: "#8B0000",
        secondaryColor: "#FF6B00",
        fontArabic: "Cairo",
        fontEnglish: "Inter",
        phones: ["0554460672", "0530783848"],
        email: "info@wiswis.com",
        address: { ar: "المملكة العربية السعودية", en: "Saudi Arabia" },
      });
    }

    // Seed Hero
    const existingHero = await Hero.findOne();
    if (!existingHero) {
      await Hero.create({
        title: { ar: "نحو رحلة بلا حدود", en: "Towards a Limitless Journey" },
        subtitle: { ar: "نقدم تجربة متكاملة من خدمات الوقود والخدمات المساندة", en: "We deliver a complete fuel and roadside service experience" },
        backgroundType: "image",
        isActive: true,
      });
    }

    // Seed About
    const existingAbout = await About.findOne();
    if (!existingAbout) {
      await About.create({
        title: { ar: "من نحن", en: "About Us" },
        description: {
          ar: "ويسويس شركة رائدة في مجال خدمات الوقود والخدمات المساندة على الطرق. نسعى لتقديم تجربة متكاملة تجمع بين جودة الخدمة وراحة العملاء.",
          en: "Wiswis is a leading company in fuel services and roadside assistance. We strive to deliver a comprehensive experience that combines service quality with customer comfort."
        },
        yearsOfExperience: 15,
      });
    }

    // Seed Services
    const existingServices = await Service.find();
    if (existingServices.length === 0) {
      await Service.insertMany([
        { title: { ar: "محطات الوقود", en: "Fuel Stations" }, description: { ar: "محطات وقود حديثة ومجهزة بأعلى معايير الجودة والسلامة", en: "Modern fuel stations equipped with the highest quality and safety standards" }, icon: "Fuel", order: 1 },
        { title: { ar: "غسيل السيارات", en: "Car Wash" }, description: { ar: "خدمات غسيل متكاملة للسيارات بأحدث التقنيات", en: "Complete car wash services with the latest technologies" }, icon: "Car", order: 2 },
        { title: { ar: "الصيانة", en: "Maintenance" }, description: { ar: "خدمات صيانة شاملة لجميع أنواع المركبات", en: "Comprehensive maintenance services for all vehicle types" }, icon: "Wrench", order: 3 },
        { title: { ar: "المتجر", en: "Supermarket" }, description: { ar: "متاجر متكاملة توفر جميع احتياجاتكم", en: "Complete stores providing all your needs" }, icon: "ShoppingCart", order: 4 },
        { title: { ar: "القهوة", en: "Coffee" }, description: { ar: "قهوة مميزة لاستراحة مثالية أثناء رحلتكم", en: "Premium coffee for the perfect break during your journey" }, icon: "Coffee", order: 5 },
      ]);
    }

    // Seed Stats
    const existingStats = await Stat.find();
    if (existingStats.length === 0) {
      await Stat.insertMany([
        { key: "years", value: 15, label: { ar: "سنوات الخبرة", en: "Years of Experience" }, icon: "Calendar", order: 1 },
        { key: "stations", value: 25, label: { ar: "محطات الوقود", en: "Fuel Stations" }, icon: "MapPin", order: 2 },
        { key: "cities", value: 10, label: { ar: "مدن مغطاة", en: "Cities Covered" }, icon: "Building", order: 3 },
        { key: "customers", value: 50000, label: { ar: "عملاء سعداء", en: "Happy Customers" }, icon: "Users", order: 4 },
      ]);
    }

    // Seed Branches
    const existingBranches = await Branch.find();
    if (existingBranches.length === 0) {
      await Branch.insertMany([
        { name: { ar: "فرع الرياض", en: "Riyadh Branch" }, city: { ar: "الرياض", en: "Riyadh" }, latitude: 24.7136, longitude: 46.6753, status: "open" },
        { name: { ar: "فرع جدة", en: "Jeddah Branch" }, city: { ar: "جدة", en: "Jeddah" }, latitude: 21.5433, longitude: 39.1728, status: "open" },
        { name: { ar: "فرع الدمام", en: "Dammam Branch" }, city: { ar: "الدمام", en: "Dammam" }, latitude: 26.3927, longitude: 49.9777, status: "open" },
      ]);
    }

    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
