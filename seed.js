const fs = require('fs');
const envConfig = fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2].trim();
});
const mongoose = require('mongoose');

// Define schemas locally for the seed script
const ServiceSchema = new mongoose.Schema({
  titleEn: String, titleAr: String, descriptionEn: String, descriptionAr: String, imageUrl: String, order: Number
});
const BranchSchema = new mongoose.Schema({
  nameEn: String, nameAr: String, descEn: String, descAr: String, cityEn: String, cityAr: String, mapUrl: String, lat: Number, lng: Number, isActive: Boolean
});
const NewsSchema = new mongoose.Schema({
  titleEn: String, titleAr: String, descriptionEn: String, descriptionAr: String, imageUrl: String, date: Date, isFeatured: Boolean
});

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
    const Branch = mongoose.models.Branch || mongoose.model('Branch', BranchSchema);
    const News = mongoose.models.News || mongoose.model('News', NewsSchema);

    // Seed Services
    const servicesCount = await Service.countDocuments();
    if (servicesCount === 0) {
      await Service.insertMany([
        { titleEn: 'Fuel Stations', titleAr: 'محطات الوقود', descriptionEn: 'High-performance fuel for optimal engine efficiency.', descriptionAr: 'وقود عالي الأداء لكفاءة المحرك المثالية.', imageUrl: '/assets/wiswis_services.png', order: 1 },
        { titleEn: 'Car Wash', titleAr: 'غسيل السيارات', descriptionEn: 'Premium automated and manual detailing services.', descriptionAr: 'خدمات غسيل وتلميع آلية ويدوية فاخرة.', imageUrl: '/assets/wiswis_hero.png', order: 2 },
        { titleEn: 'Maintenance', titleAr: 'الصيانة', descriptionEn: 'Expert diagnostics and rapid roadside repair.', descriptionAr: 'تشخيص الأعطال وإصلاح سريع على الطريق.', imageUrl: '/assets/wiswis_about.png', order: 3 },
        { titleEn: 'Supermarket', titleAr: 'سوبر ماركت', descriptionEn: '24/7 premium convenience stores for your journey.', descriptionAr: 'متاجر تموينات فاخرة لخدمتك في رحلتك 24/7.', imageUrl: '/assets/wiswis_services.png', order: 4 },
        { titleEn: 'Coffee & Lounge', titleAr: 'قهوة واستراحة', descriptionEn: 'High-end barista coffee and relaxation zones.', descriptionAr: 'قهوة مختصة وأماكن استرخاء راقية.', imageUrl: '/assets/wiswis_hero.png', order: 5 }
      ]);
      console.log('Services seeded');
    }

    // Seed Branches
    const branchesCount = await Branch.countDocuments();
    if (branchesCount === 0) {
      await Branch.insertMany([
        { nameEn: 'King Fahd Road Station', nameAr: 'محطة طريق الملك فهد', descEn: 'Full Service • 24/7', descAr: 'خدمة كاملة • 24/7', cityEn: 'Riyadh', cityAr: 'الرياض', mapUrl: '', lat: 24.7136, lng: 46.6753, isActive: true },
        { nameEn: 'Airport Highway Station', nameAr: 'محطة طريق المطار', descEn: 'Fuel & Coffee • 24/7', descAr: 'وقود وقهوة • 24/7', cityEn: 'Jeddah', cityAr: 'جدة', mapUrl: '', lat: 21.5433, lng: 39.1728, isActive: true },
        { nameEn: 'Corniche Branch', nameAr: 'فرع الكورنيش', descEn: 'Supermarket & Wash', descAr: 'سوبر ماركت وغسيل', cityEn: 'Dammam', cityAr: 'الدمام', mapUrl: '', lat: 26.4207, lng: 50.0888, isActive: true }
      ]);
      console.log('Branches seeded');
    }

    // Seed News
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      await News.insertMany([
        { titleEn: 'Wiswis Expands Green Energy Initiative', titleAr: 'وسوس توسع مبادرة الطاقة الخضراء في 50 محطة', descriptionEn: 'Introducing EV charging infrastructure and solar-powered facilities.', descriptionAr: 'تقديم البنية التحتية لشحن السيارات الكهربائية والمرافق التي تعمل بالطاقة الشمسية.', imageUrl: '/assets/wiswis_services.png', isFeatured: true },
        { titleEn: 'New Luxury Lounges Opened', titleAr: 'افتتاح استراحات فاخرة جديدة', descriptionEn: 'Experience ultimate comfort in our new VIP lounges.', descriptionAr: 'جرب أقصى درجات الراحة في صالات كبار الشخصيات الجديدة.', imageUrl: '/assets/wiswis_about.png', isFeatured: false },
        { titleEn: 'Partnership with Premium Coffee', titleAr: 'شراكة مع علامات تجارية عالمية للقهوة', descriptionEn: 'We partnered with top coffee brands for our stations.', descriptionAr: 'عقدنا شراكة مع أفضل العلامات التجارية للقهوة لمحطاتنا.', imageUrl: '/assets/wiswis_hero.png', isFeatured: false }
      ]);
      console.log('News seeded');
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
