"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, CheckCircle2, Milestone, ChevronRight, ChevronLeft } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { t, getLocalizedField } from "@/lib/i18n";
import Link from "next/link";

const fallbackAbout = {
  title: { ar: "قصة ويسويس: جودة تفوق التوقعات", en: "The WISWIS Story: Quality Beyond Limits" },
  description: {
    ar: "انطلقت ويسويس لتضع بصمتها في عالم خدمات الوقود، ملتزمة بتقديم أعلى معايير الجودة والاحترافية. نحن لا نوفر الوقود فحسب، بل نصنع تجربة متكاملة لمسافرينا.\n\nمن خلال شبكة متنامية من المحطات الحديثة، نسعى لتكون ويسويس الوجهة الأولى لكل باحث عن الراحة والجودة على طرقات المملكة.",
    en: "WISWIS was founded to make its mark in the fuel services world, committed to delivering the highest standards of quality and professionalism. We don't just provide fuel; we create an integrated experience for our travelers.\n\nThrough a growing network of modern stations, we aim for WISWIS to be the primary destination for everyone seeking comfort and quality on the Kingdom's roads."
  },
  yearsOfExperience: 15,
};

export default function AboutSection() {
  const { locale, dir } = useLocale();
  const [about, setAbout] = useState<any>(fallbackAbout);

  useEffect(() => {
    fetch("/api/about").then(r => r.ok ? r.json() : null).then(d => d && setAbout(d)).catch(() => {});
  }, []);

  const title = getLocalizedField(about.title, locale);
  const description = getLocalizedField(about.description, locale);
  const years = about.yearsOfExperience || 15;

  const features = [
    { ar: "وقود عالي الجودة ونقي 100%", en: "100% Pure, High-Quality Fuel" },
    { ar: "خدمات مساندة متوفرة 24/7", en: "24/7 Roadside Assistance" },
    { ar: "محطات حديثة وصديقة للبيئة", en: "Eco-friendly, Modern Stations" },
    { ar: "شراكات استراتيجية عالمية", en: "Global Strategic Partnerships" },
  ];

  return (
    <section className="py-24 relative overflow-hidden" style={{ direction: dir }}>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Visual Side */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 rounded-[3rem] overflow-hidden border border-white/5 aspect-[4/5]"
            >
              <img 
                src={about.image || "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1949&auto=format&fit=crop"} 
                alt="About Wiswis" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </motion.div>

            {/* Overlapping Info Card */}
            <motion.div
              initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50, y: 50 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-10 -end-10 z-20 glass-card p-10 rounded-[2.5rem] max-w-[300px] shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/40">
                  <Award size={32} className="text-white" />
                </div>
                <div className="text-5xl font-black text-white mb-2">{years}+</div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                  {locale === 'ar' ? 'سنة من الخبرة' : 'YEARS OF EXPERTISE'}
                </div>
              </div>
            </motion.div>

            {/* Floating Experience Ring */}
            <div className="absolute -top-10 -start-10 w-40 h-40 border border-secondary/20 rounded-full animate-float z-0" />
          </div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-secondary" />
              <span className="text-sm font-black uppercase tracking-[0.3em] text-secondary">
                {t(locale, "nav.about")}
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-[1.2]">
              {title}
            </h2>

            <div className="space-y-6 text-gray-400 text-lg leading-relaxed mb-12">
              {description.split("\n").filter(Boolean).map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-premium">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="font-bold text-gray-300">
                    {getLocalizedField(f, locale)}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-4 text-white font-black text-lg group transition-premium"
            >
              <span className="relative">
                {locale === 'ar' ? 'تواصل معنا الآن' : 'Contact Us Now'}
                <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-secondary group-hover:h-[3px] transition-all" />
              </span>
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-secondary transition-premium">
                {dir === 'rtl' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
