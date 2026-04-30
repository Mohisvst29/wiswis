import React from 'react';
import { twMerge } from 'tailwind-merge';

export function PageWrapper({ title, description, actionButton, children }: { title: string, description?: string, actionButton?: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-normal text-slate-800">{title}</h2>
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>
        {actionButton && <div>{actionButton}</div>}
      </div>
      {children}
    </div>
  );
}

export function SectionCard({ title, description, children, className }: { title: string, description?: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={twMerge("bg-white border border-slate-200 shadow-sm", className)}>
      {(title || description) && (
        <div className="p-5 border-b border-slate-200 bg-white">
          {title && <h3 className="text-[15px] font-semibold text-slate-800">{title}</h3>}
          {description && <p className="text-[13px] text-slate-500 mt-1">{description}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

export function FormGrid({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={twMerge("grid md:grid-cols-2 gap-6", className)}>{children}</div>;
}

export function FormField({ label, children, className }: { label: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={twMerge("space-y-1.5", className)}>
      <label className="text-[14px] text-slate-700 block">{label}</label>
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { dir?: "rtl" | "ltr" }) {
  return (
    <input 
      {...props} 
      className={twMerge(
        "w-full bg-white border border-slate-300 px-3 py-2 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#2271B1] focus:ring-1 focus:ring-[#2271B1] transition-all shadow-sm rounded-sm",
        props.dir === "ltr" && "text-left",
        props.className
      )} 
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { dir?: "rtl" | "ltr" }) {
  return (
    <textarea 
      {...props} 
      className={twMerge(
        "w-full bg-white border border-slate-300 px-3 py-2 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#2271B1] focus:ring-1 focus:ring-[#2271B1] transition-all shadow-sm rounded-sm resize-none",
        props.dir === "ltr" && "text-left",
        props.className
      )} 
    />
  );
}

export function Button({ children, variant = 'primary', className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'danger' | 'ghost' }) {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-1.5 text-[14px] rounded-md transition-all disabled:opacity-50 border shadow-sm";
  const variants = {
    primary: "bg-[#2271B1] border-[#2271B1] text-white hover:bg-[#135E96] hover:border-[#135E96]",
    outline: "bg-[#F6F7F7] border-[#DCDCDE] text-[#2271B1] hover:bg-[#F0F0F1] hover:text-[#135E96] hover:border-[#135E96]",
    danger: "bg-white border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300",
    ghost: "bg-transparent border-transparent text-[#2271B1] hover:bg-[#F0F2F5] hover:text-[#135E96] shadow-none"
  };
  return <button {...props} className={twMerge(base, variants[variant], className)}>{children}</button>;
}
