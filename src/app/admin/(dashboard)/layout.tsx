"use client";
import React, { useState } from "react";
import "./admin.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Paintbrush, ImageIcon, Layers, MapPin, FileText, Users, MessageSquare, LogOut, Menu, X, Save } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const menuItems = [
    { name: "الرئيسية", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "الإعدادات والمظهر", href: "/admin/settings", icon: Paintbrush },
    { name: "مدير الوسائط", href: "/admin/media", icon: ImageIcon },
    { name: "إدارة الهيرو", href: "/admin/hero", icon: ImageIcon },
    { name: "الخدمات", href: "/admin/services", icon: Layers },
    { name: "المحطات والفروع", href: "/admin/branches", icon: MapPin },
    { name: "الأخبار والمقالات", href: "/admin/news", icon: FileText },
    { name: "شركاء النجاح", href: "/admin/partners", icon: Users },
    { name: "صندوق الرسائل", href: "/admin/messages", icon: MessageSquare },
  ];

  return (
    <div dir="rtl" className="flex h-screen bg-[#f0f0f1] text-[#3c434a] font-sans overflow-hidden">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-[#000]/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-[160px] bg-[#1d2327] text-white transition-transform duration-300 ease-in-out flex flex-col md:static ${sidebarOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0`}>
        <div className="flex items-center h-[32px] px-4 bg-[#1d2327]">
          {/* Empty spacer for WP admin bar */}
        </div>
        <nav className="flex-1 py-3 custom-scrollbar space-y-0">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => setSidebarOpen(false)} 
                className={`flex items-center gap-3 px-4 py-2 text-[13px] transition-colors relative ${isActive ? 'bg-[#2271b1] text-white' : 'text-[#f0f0f1] hover:bg-[#2c3338] hover:text-[#72aee6]'}`}
              >
                <item.icon size={18} className={isActive ? 'text-white' : 'text-[#a7aaad]'} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f0f0f1]">
        {/* WP Topbar (Admin Bar) */}
        <header className="h-[32px] bg-[#1d2327] text-white flex items-center justify-between px-4 z-10 sticky top-0 md:flex">
          <div className="flex items-center gap-4 h-full">
            <button className="md:hidden text-white/70 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 h-full hover:bg-[#2c3338] px-2 cursor-pointer transition-colors">
              <span className="text-[13px]">وسوس لخدمات الوقود</span>
            </div>
          </div>
          <div className="flex items-center gap-2 h-full hover:bg-[#2c3338] px-2 cursor-pointer transition-colors" onClick={handleLogout}>
            <span className="text-[13px]">مرحباً، مدير</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div className="max-w-[1200px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
