"use client";
import React, { useState, useEffect } from "react";
import { Layers, MapPin, Newspaper, MessageSquare, BarChart, Users } from "lucide-react";

export default function DashboardHome() {
  const [counts, setCounts] = useState({ services: 0, branches: 0, news: 0, messages: 0, partners: 0, stats: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/services").then(r => r.json()),
      fetch("/api/branches").then(r => r.json()),
      fetch("/api/news").then(r => r.json()),
      fetch("/api/contact").then(r => r.json()),
      fetch("/api/partners").then(r => r.json()),
      fetch("/api/stats").then(r => r.json()),
    ]).then(([s, b, n, m, p, st]) => {
      setCounts({
        services: Array.isArray(s) ? s.length : 0,
        branches: Array.isArray(b) ? b.length : 0,
        news: Array.isArray(n) ? n.length : 0,
        messages: Array.isArray(m) ? m.length : 0,
        partners: Array.isArray(p) ? p.length : 0,
        stats: Array.isArray(st) ? st.length : 0,
      });
    }).catch(console.error);
  }, []);

  const cards = [
    { label: "Services", count: counts.services, icon: Layers, color: "from-red-900 to-red-700" },
    { label: "Branches", count: counts.branches, icon: MapPin, color: "from-orange-900 to-orange-700" },
    { label: "News Posts", count: counts.news, icon: Newspaper, color: "from-blue-900 to-blue-700" },
    { label: "Messages", count: counts.messages, icon: MessageSquare, color: "from-green-900 to-green-700" },
    { label: "Partners", count: counts.partners, icon: Users, color: "from-purple-900 to-purple-700" },
    { label: "Stats", count: counts.stats, icon: BarChart, color: "from-yellow-900 to-yellow-700" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Welcome to Wiswis Admin</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass rounded-xl p-6 hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <Icon size={22} className="text-white" />
                </div>
                <span className="text-3xl font-bold text-white">{card.count}</span>
              </div>
              <p className="text-gray-400 text-sm">{card.label}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-8 glass rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2">Quick Actions</h3>
        <p className="text-gray-400 text-sm">Use the sidebar to navigate and manage your website content. All changes are reflected instantly on the live site.</p>
      </div>
    </div>
  );
}
