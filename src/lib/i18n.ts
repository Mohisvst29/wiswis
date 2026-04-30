export type Locale = "ar" | "en";

export const defaultLocale: Locale = "ar";

export const locales: Locale[] = ["ar", "en"];

export const localeNames: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
};

export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
};

const translations = {
  ar: {
    // Nav
    "nav.home": "الرئيسية",
    "nav.about": "من نحن",
    "nav.services": "خدماتنا",
    "nav.branches": "فروعنا",
    "nav.news": "الأخبار",
    "nav.contact": "تواصل معنا",
    "nav.admin": "لوحة التحكم",

    // Hero
    "hero.exploreServices": "استكشف خدماتنا",
    "hero.contactUs": "تواصل معنا",

    // Stats
    "stats.yearsExperience": "سنوات الخبرة",
    "stats.stations": "محطات الوقود",
    "stats.cities": "مدن مغطاة",
    "stats.customers": "عملاء سعداء",

    // About
    "about.title": "من نحن",
    "about.yearsExperience": "سنوات من الخبرة",

    // Services
    "services.title": "خدماتنا",
    "services.subtitle": "نقدم مجموعة متكاملة من الخدمات لتلبية احتياجاتكم",

    // Branches
    "branches.title": "فروعنا",
    "branches.subtitle": "تغطي محطاتنا مناطق متعددة في المملكة",
    "branches.open": "مفتوح",
    "branches.closed": "مغلق",

    // News
    "news.title": "آخر الأخبار",
    "news.subtitle": "تابع أحدث أخبارنا ومستجداتنا",
    "news.readMore": "اقرأ المزيد",

    // Partners
    "partners.title": "شركاؤنا",
    "partners.subtitle": "نفتخر بالتعاون مع أبرز الشركات",

    // Contact
    "contact.title": "تواصل معنا",
    "contact.subtitle": "نحن هنا لخدمتكم على مدار الساعة",
    "contact.name": "الاسم الكامل",
    "contact.email": "البريد الإلكتروني",
    "contact.phone": "رقم الهاتف",
    "contact.message": "رسالتك",
    "contact.send": "إرسال الرسالة",
    "contact.sending": "جاري الإرسال...",
    "contact.success": "تم إرسال رسالتك بنجاح!",
    "contact.error": "حدث خطأ، يرجى المحاولة مرة أخرى",
    "contact.phones": "أرقام الهواتف",
    "contact.emailLabel": "البريد الإلكتروني",
    "contact.location": "الموقع",

    // Footer
    "footer.description": "شركة متخصصة في خدمات الوقود والخدمات المساندة على الطرق في المملكة العربية السعودية.",
    "footer.quickLinks": "روابط سريعة",
    "footer.contactInfo": "معلومات التواصل",
    "footer.rights": "جميع الحقوق محفوظة",
    "footer.followUs": "تابعنا",

    // Common
    "common.loading": "جاري التحميل...",
  },
  en: {
    // Nav
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.branches": "Branches",
    "nav.news": "News",
    "nav.contact": "Contact",
    "nav.admin": "Dashboard",

    // Hero
    "hero.exploreServices": "Explore Services",
    "hero.contactUs": "Contact Us",

    // Stats
    "stats.yearsExperience": "Years of Experience",
    "stats.stations": "Fuel Stations",
    "stats.cities": "Cities Covered",
    "stats.customers": "Happy Customers",

    // About
    "about.title": "About Us",
    "about.yearsExperience": "Years of Experience",

    // Services
    "services.title": "Our Services",
    "services.subtitle": "A comprehensive suite of services to meet your needs",

    // Branches
    "branches.title": "Our Branches",
    "branches.subtitle": "Our stations cover multiple regions across the Kingdom",
    "branches.open": "Open",
    "branches.closed": "Closed",

    // News
    "news.title": "Latest News",
    "news.subtitle": "Stay updated with our latest news and developments",
    "news.readMore": "Read More",

    // Partners
    "partners.title": "Our Partners",
    "partners.subtitle": "Proud to collaborate with leading companies",

    // Contact
    "contact.title": "Contact Us",
    "contact.subtitle": "We are here to serve you around the clock",
    "contact.name": "Full Name",
    "contact.email": "Email Address",
    "contact.phone": "Phone Number",
    "contact.message": "Your Message",
    "contact.send": "Send Message",
    "contact.sending": "Sending...",
    "contact.success": "Your message has been sent successfully!",
    "contact.error": "An error occurred, please try again",
    "contact.phones": "Phone Numbers",
    "contact.emailLabel": "Email",
    "contact.location": "Location",

    // Footer
    "footer.description": "A specialized company in fuel services and roadside assistance in Saudi Arabia.",
    "footer.quickLinks": "Quick Links",
    "footer.contactInfo": "Contact Info",
    "footer.rights": "All rights reserved",
    "footer.followUs": "Follow Us",

    // Common
    "common.loading": "Loading...",
  },
} as const;

export type TranslationKey = keyof typeof translations.ar;

export function getTranslations(locale: Locale) {
  return translations[locale];
}

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] || key;
}

// Helper to get localized field from a bilingual object
export function getLocalizedField(obj: { ar?: string; en?: string } | undefined, locale: Locale): string {
  if (!obj) return "";
  return obj[locale] || obj[defaultLocale] || "";
}
