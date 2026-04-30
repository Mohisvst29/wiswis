"use client";
import React, { useEffect, useState } from "react";
import { Users, Layers, MapPin, MessageSquare, ArrowUpLeft } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({ services: 0, branches: 0, messages: 0, news: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [srv, br, msg, nw] = await Promise.all([
          fetch('/api/services').then(res => res.json()),
          fetch('/api/branches').then(res => res.json()),
          fetch('/api/contact').then(res => res.json()),
          fetch('/api/news').then(res => res.json())
        ]);
        setStats({
          services: srv.length || 0,
          branches: br.length || 0,
          messages: msg.length || 0,
          news: nw.length || 0
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "إجمالي الخدمات", value: stats.services, icon: Layers, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-500/20", link: "/admin/services" },
    { title: "المحطات النشطة", value: stats.branches, icon: MapPin, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/20", link: "/admin/branches" },
    { title: "الرسائل الواردة", value: stats.messages, icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-500/20", link: "/admin/messages" },
    { title: "المقالات والأخبار", value: stats.news, icon: Users, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-500/20", link: "/admin/news" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">مرحباً بك في لوحة الإدارة 👋</h1>
          <p className="text-gray-400">إليك نظرة عامة على إحصائيات منصة وسوس</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className={`bg-[#111] border ${card.border} rounded-2xl p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 shadow-lg`}>
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.bg}`}>
                <card.icon size={28} className={card.color} />
              </div>
              <Link href={card.link} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                <ArrowUpLeft size={20} />
              </Link>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-white mb-2">{card.value}</h3>
              <p className="text-gray-400 font-medium">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6">آخر النشاطات</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <p className="text-gray-300 font-medium">تم تسجيل الدخول بنجاح إلى لوحة الإدارة</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-900/40 to-black border border-red-900/30 rounded-2xl p-6 shadow-lg relative overflow-hidden flex flex-col justify-center min-h-[200px]">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/wiswis_hero.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">النظام يعمل بكفاءة 🚀</h3>
            <p className="text-red-200/80 mb-6 max-w-md mx-auto">جميع الواجهات البرمجية وقاعدة البيانات متصلة وتعمل بأعلى أداء.</p>
            <Link href="/admin/settings" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-red-900/50">
              تخصيص المظهر <Paintbrush size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Paintbrush } from "lucide-react";
