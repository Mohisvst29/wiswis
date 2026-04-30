"use client";
import React, { useState, useEffect } from "react";
import { Trash2, CheckCircle, Mail, Clock, Inbox } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const res = await fetch('/api/contact');
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
  };

  const markAsRead = async (id: string) => {
    await fetch(`/api/contact/${id}`, { method: 'PUT' });
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      fetchMessages();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-20">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">صندوق الرسائل</h2>
        <p className="text-sm text-slate-500 mt-1">تصفح رسائل العملاء القادمة من نموذج اتصل بنا.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Inbox size={28} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">لا توجد رسائل جديدة</h3>
            <p className="text-slate-500 text-sm mt-1">صندوق الوارد الخاص بك فارغ حالياً.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {messages.map((msg) => (
              <div key={msg._id} className={`p-6 transition-colors ${msg.isRead ? 'bg-white' : 'bg-blue-50/30'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold ${msg.isRead ? 'bg-slate-300' : 'bg-blue-500 shadow-sm shadow-blue-500/20'}`}>
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className={`text-base ${msg.isRead ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>{msg.name}</h4>
                        {!msg.isRead && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">جديد</span>}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><Mail size={12}/> {msg.email}</span>
                        <span className="flex items-center gap-1.5"><Clock size={12}/> {new Date(msg.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <h5 className="font-semibold text-slate-900 mt-3">{msg.subject}</h5>
                      <p className="text-sm text-slate-600 leading-relaxed mt-2 p-4 bg-slate-50 rounded-lg border border-slate-100">{msg.message}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {!msg.isRead && (
                      <button onClick={() => markAsRead(msg._id)} className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                        <CheckCircle size={14}/> تحديد كمقروء
                      </button>
                    )}
                    <button onClick={() => handleDelete(msg._id)} className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 size={14}/> حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
