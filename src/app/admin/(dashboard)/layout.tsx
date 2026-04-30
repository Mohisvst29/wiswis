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
    <div dir="rtl" className="flex h-screen bg-[#F9FAFB] text-slate-900 font-sans overflow-hidden">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-slate-200 transition-transform duration-300 ease-in-out flex flex-col shadow-sm ${sidebarOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0 md:static`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <span className="text-xl font-bold text-slate-900">وسوس - لوحة الإدارة</span>
          <button className="md:hidden text-slate-500 hover:text-slate-900" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => setSidebarOpen(false)} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border-r-4 ${isActive ? 'bg-[#7A0C16]/10 text-[#7A0C16] border-[#7A0C16]' : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-[#7A0C16]'}`}
              >
                <item.icon size={18} className={isActive ? 'text-[#7A0C16]' : 'text-slate-500'} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut size={18} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500 hover:text-slate-900 p-2 -mr-2 rounded-lg hover:bg-slate-50" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-slate-900 hidden sm:block">لوحة التحكم (Admin Panel)</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
              W
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
