"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Settings, Image, Layers, MapPin, Newspaper, Users, MessageSquare, BarChart, LogOut, Menu, X, Fuel } from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Settings", icon: Settings, href: "/admin/dashboard/settings" },
  { label: "Hero", icon: Image, href: "/admin/dashboard/hero" },
  { label: "About", icon: Fuel, href: "/admin/dashboard/about" },
  { label: "Services", icon: Layers, href: "/admin/dashboard/services" },
  { label: "Branches", icon: MapPin, href: "/admin/dashboard/branches" },
  { label: "News", icon: Newspaper, href: "/admin/dashboard/news" },
  { label: "Partners", icon: Users, href: "/admin/dashboard/partners" },
  { label: "Stats", icon: BarChart, href: "/admin/dashboard/stats" },
  { label: "Messages", icon: MessageSquare, href: "/admin/dashboard/messages" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/check").then(r => {
      if (!r.ok) router.push("/admin");
    }).catch(() => router.push("/admin"));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex" dir="ltr">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111] border-r border-white/5 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ background: "var(--gradient-primary)" }}>W</div>
            <span className="font-bold text-white">Wiswis Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400"><X size={20} /></button>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 120px)" }}>
          {sidebarItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? "bg-red-900/20 text-white border border-red-900/30" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                <Icon size={18} />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-900/10 w-full transition-colors">
            <LogOut size={18} />Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 min-h-screen">
        <header className="sticky top-0 z-30 glass border-b border-white/5 px-4 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400"><Menu size={20} /></button>
          <h1 className="text-lg font-semibold text-white">
            {sidebarItems.find(i => i.href === pathname)?.label || "Dashboard"}
          </h1>
          <Link href="/" target="_blank" className="ml-auto text-sm text-gray-400 hover:text-white transition-colors">View Site →</Link>
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
