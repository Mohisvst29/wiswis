"use client";
import React, { useState, useEffect } from "react";
import { PageWrapper, SectionCard, Button } from "@/components/ui/LayoutComponents";
import { Trash2, CheckCircle, Mail, Clock, Inbox } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => { fetchMessages(); }, []);
  const fetchMessages = async () => { const res = await fetch('/api/contact'); const data = await res.json(); setMessages(Array.isArray(data) ? data : []); };
  const markAsRead = async (id: string) => { await fetch(`/api/contact/${id}`, { method: 'PUT' }); fetchMessages(); };
  const handleDelete = async (id: string) => { if (confirm('حذف؟')) { await fetch(`/api/contact/${id}`, { method: 'DELETE' }); fetchMessages(); } };

  return (
    <PageWrapper title="صندوق الرسائل (Messages)">
      <SectionCard title="الرسائل الواردة" className="p-0">
        {messages.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><Inbox size={28} className="text-slate-300" /></div>
            <h3 className="text-lg font-medium text-slate-900">لا توجد رسائل جديدة</h3>
            <p className="text-slate-500 text-sm mt-1">صندوق الوارد فارغ.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {messages.map((msg) => (
              <div key={msg._id} className={`p-6 transition-colors ${msg.isRead ? 'bg-white' : 'bg-slate-50'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold text-lg ${msg.isRead ? 'bg-slate-300' : 'bg-[#7A0C16]'}`}>{msg.name.charAt(0)}</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className={`text-base ${msg.isRead ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>{msg.name}</h4>
                        {!msg.isRead && <span className="bg-[#7A0C16] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">جديد</span>}
                      </div>
                      <div className="flex gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><Mail size={12}/> {msg.email}</span>
                        <span className="flex items-center gap-1.5"><Clock size={12}/> {new Date(msg.createdAt).toLocaleDateString('ar-EG', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })}</span>
                      </div>
                      <h5 className="font-semibold text-slate-900 mt-4">{msg.subject}</h5>
                      <p className="text-sm text-slate-600 leading-relaxed mt-2 p-4 bg-white border border-slate-200 rounded-xl">{msg.message}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {!msg.isRead && <Button variant="outline" className="text-xs" onClick={() => markAsRead(msg._id)}><CheckCircle size={14}/> تحديد كمقروء</Button>}
                    <Button variant="danger" className="text-xs" onClick={() => handleDelete(msg._id)}><Trash2 size={14}/> حذف</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </PageWrapper>
  );
}
