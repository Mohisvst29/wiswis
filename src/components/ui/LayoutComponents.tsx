import React from 'react';
import { twMerge } from 'tailwind-merge';

export function PageWrapper({ title, description, actionButton, children }: { title: string, description?: string, actionButton?: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
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
    <div className={twMerge("bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden", className)}>
      {(title || description) && (
        <div className="p-6 border-b border-slate-100 bg-white">
          {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
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
    <div className={twMerge("space-y-2", className)}>
      <label className="text-sm font-medium text-slate-700 block">{label}</label>
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { dir?: "rtl" | "ltr" }) {
  return (
    <input 
      {...props} 
      className={twMerge(
        "w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all shadow-sm",
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
        "w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all shadow-sm resize-none",
        props.dir === "ltr" && "text-left",
        props.className
      )} 
    />
  );
}

export function Button({ children, variant = 'primary', className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'danger' | 'ghost' }) {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all disabled:opacity-50 shadow-sm";
  const variants = {
    primary: "bg-slate-900 hover:bg-slate-800 text-white",
    outline: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-none"
  };
  return <button {...props} className={twMerge(base, variants[variant], className)}>{children}</button>;
}
