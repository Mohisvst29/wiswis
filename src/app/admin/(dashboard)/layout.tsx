"use client";
import React, { useState } from "react";
import "./admin.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Settings, Layers, MapPin, FileText, Users, Image as ImageIcon, MessageSquare, LogOut, Menu, X, Paintbrush } from "lucide-react";

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
    { name: "إدارة الهيرو (الصور)", href: "/admin/hero", icon: ImageIcon },
    { name: "إدارة الخدمات", href: "/admin/services", icon: Layers },
    { name: "إدارة المحطات", href: "/admin/branches", icon: MapPin },
    { name: "الأخبار والمقالات", href: "/admin/news", icon: FileText },
    { name: "شركاء النجاح", href: "/admin/partners", icon: Users },
    { name: "صندوق الرسائل", href: "/admin/messages", icon: MessageSquare },
  ];

  return (
    <div dir="rtl" className="flex h-screen bg-[#0a0a0a] text-gray-100 font-sans overflow-hidden">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-[#111] border-l border-white/5 transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0 md:static`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">وسوس - الإدارة</span>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-red-900/40 to-transparent text-red-400 border-r-2 border-red-500 shadow-[inset_0_0_20px_rgba(255,0,0,0.05)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                <item.icon size={20} className={isActive ? 'text-red-400' : 'text-gray-500'} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5 bg-[#0d0d0d]">
          <button onClick={handleLogout} className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors">
            <LogOut size={20} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Topbar */}
        <header className="h-20 bg-[#111]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-10 sticky top-0">
          <button className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-left hidden sm:block" dir="ltr">
              <p className="font-bold text-white">مدير النظام</p>
              <p className="text-gray-500 text-xs">admin@wiswis.com</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-red-900/20">
              W
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
