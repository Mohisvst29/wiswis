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
    <div dir="rtl" className="flex h-screen bg-[#F0F2F5] text-slate-900 font-sans overflow-hidden">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-[260px] bg-[#2271B1] text-white transition-transform duration-300 ease-in-out flex flex-col shadow-xl md:shadow-none ${sidebarOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0 md:static`}>
        <div className="flex items-center justify-between h-[72px] px-6">
          <div className="flex items-center gap-3">
            <Menu size={24} className="text-white/80 cursor-pointer md:hidden" onClick={() => setSidebarOpen(false)} />
            <span className="text-xl font-medium tracking-wide">Menu</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => setSidebarOpen(false)} 
                className={`flex items-center gap-4 px-6 py-3.5 text-[15px] transition-colors relative ${isActive ? 'bg-[#135E96] font-medium text-white' : 'text-white/80 hover:bg-[#1A68A2] hover:text-white'}`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-white/70'} />
                {item.name}
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>}
              </Link>
            );
          })}
        </nav>
        <div className="p-4">
          <button onClick={handleLogout} className="flex items-center gap-4 w-full px-4 py-3.5 text-[15px] text-white/80 hover:bg-[#1A68A2] hover:text-white transition-colors rounded-none">
            <LogOut size={20} className="text-white/70" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F0F2F5]">
        {/* Mobile Topbar Only */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 sticky top-0 shadow-sm md:hidden">
          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-slate-900 p-2 -mr-2 rounded-lg hover:bg-slate-50" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-slate-900">وسوس لخدمات الوقود</h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
