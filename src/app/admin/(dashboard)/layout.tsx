"use client";
import React, { useState } from "react";
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
    { name: "الصفحة الرئيسية", href: "/admin/home", icon: ImageIcon },
    { name: "مدير الوسائط", href: "/admin/media", icon: ImageIcon },
    { name: "الخدمات", href: "/admin/services", icon: Layers },
    { name: "المحطات والفروع", href: "/admin/branches", icon: MapPin },
    { name: "الأخبار والمقالات", href: "/admin/news", icon: FileText },
    { name: "شركاء النجاح", href: "/admin/partners", icon: Users },
    { name: "معرض الصور", href: "/admin/gallery", icon: ImageIcon },
    { name: "صندوق الرسائل", href: "/admin/messages", icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-gray-900 font-sans overflow-hidden">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gray-900/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-[240px] bg-white border-l border-gray-200 transition-transform duration-300 ease-in-out flex flex-col md:static ${sidebarOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0`}>
        <div className="flex items-center justify-center h-[64px] border-b border-gray-200">
          <span className="text-xl font-bold tracking-tight text-gray-900">شركة وسوس للتجارة</span>
          <button className="md:hidden absolute left-4 text-gray-500 hover:text-gray-900" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 custom-scrollbar space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => setSidebarOpen(false)} 
                className={`flex items-center gap-3 px-3 py-3 text-sm font-semibold rounded-xl transition-colors ${isActive ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <item.icon size={20} className={isActive ? 'text-red-700' : 'text-gray-400'} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F9FAFB]">
        {/* Topbar */}
        <header className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 sticky top-0 md:flex">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-500 hover:text-gray-900" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="text-sm font-semibold text-gray-500">لوحة التحكم الإدارية</div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors">
              <LogOut size={16} />
              تسجيل خروج
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
