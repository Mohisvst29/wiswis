import React from 'react';
import { twMerge } from 'tailwind-merge';

export function PageWrapper({ title, description, actionButton, children }: { title: string, description?: string, actionButton?: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        {actionButton && <div>{actionButton}</div>}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

export function SectionCard({ title, description, children, className }: { title: string, description?: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={twMerge("bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden", className)}>
      {(title || description) && (
        <div className="p-6 border-b border-gray-100 bg-white">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
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
      <label className="text-sm font-semibold text-gray-700 block">{label}</label>
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { dir?: "rtl" | "ltr" }) {
  return (
    <input 
      {...props} 
      className={twMerge(
        "w-full h-11 bg-white border border-gray-300 px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all shadow-sm rounded-xl",
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
        "w-full bg-white border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all shadow-sm rounded-xl resize-y",
        props.dir === "ltr" && "text-left",
        props.className
      )} 
    />
  );
}

export function Button({ children, variant = 'primary', className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'danger' | 'ghost' }) {
  const base = "inline-flex items-center justify-center gap-2 px-6 h-11 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 shadow-sm border";
  const variants = {
    primary: "bg-red-700 border-red-700 text-white hover:bg-red-800 hover:border-red-800",
    outline: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50",
    danger: "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300",
    ghost: "bg-transparent border-transparent text-gray-600 hover:bg-gray-100 shadow-none"
  };
  return <button {...props} className={twMerge(base, variants[variant], className)}>{children}</button>;
}
