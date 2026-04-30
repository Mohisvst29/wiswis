"use client";
import React, { useEffect, useState } from "react";
import { Users, Layers, MapPin, MessageSquare, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({ services: 0, branches: 0, messages: 0, news: 0 });

  useEffect(() => {
    // Fetch real stats here in a real app
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
    { title: "Total Services", value: stats.services, icon: Layers, color: "text-blue-400", bg: "bg-blue-400/10", link: "/admin/services" },
    { title: "Active Branches", value: stats.branches, icon: MapPin, color: "text-emerald-400", bg: "bg-emerald-400/10", link: "/admin/branches" },
    { title: "Unread Messages", value: stats.messages, icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-400/10", link: "/admin/messages" },
    { title: "News Posts", value: stats.news, icon: Users, color: "text-purple-400", bg: "bg-purple-400/10", link: "/admin/news" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.bg}`}>
                <card.icon size={24} className={card.color} />
              </div>
              <Link href={card.link} className="text-gray-500 hover:text-white transition-colors">
                <ArrowUpRight size={20} />
              </Link>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">{card.title}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Dashboard layout created successfully.</p>
            <p className="text-gray-400 text-sm">Ready to manage the Wiswis platform.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
