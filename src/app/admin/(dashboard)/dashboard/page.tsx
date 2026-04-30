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
    { title: "إجمالي الخدمات", value: stats.services, icon: Layers, link: "/admin/services" },
    { title: "المحطات النشطة", value: stats.branches, icon: MapPin, link: "/admin/branches" },
    { title: "الرسائل الواردة", value: stats.messages, icon: MessageSquare, link: "/admin/messages" },
    { title: "الأخبار والمقالات", value: stats.news, icon: Users, link: "/admin/news" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">نظرة عامة</h2>
        <p className="text-sm text-slate-500 mt-1">إحصائيات وبيانات المنصة الخاصة بك.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <card.icon size={16} className="text-slate-400" />
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-slate-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">آخر النشاطات</h3>
            <p className="text-sm text-slate-500 mt-1">سجل التحديثات الحديثة في النظام.</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-slate-900"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">تم تسجيل الدخول بنجاح</p>
                  <p className="text-xs text-slate-500">منذ دقائق</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
