import React from 'react';
import { twMerge } from 'tailwind-merge';

export function PageWrapper({ title, description, actionButton, children }: { title: string, description?: string, actionButton?: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in duration-200 pb-20">
      <div className="flex items-center gap-4 mb-4 mt-2">
        <h1 className="text-[23px] text-[#1d2327] font-normal leading-tight">{title}</h1>
        {actionButton && <div className="mt-1">{actionButton}</div>}
      </div>
      {description && <p className="text-[13px] text-[#50575e] mb-6">{description}</p>}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

export function SectionCard({ title, description, children, className }: { title: string, description?: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={twMerge("bg-white border border-[#c3c4c7] shadow-[0_1px_1px_rgba(0,0,0,0.04)] box-border", className)}>
      {(title || description) && (
        <div className="p-4 border-b border-[#c3c4c7] bg-white">
          {title && <h2 className="text-[14px] font-semibold text-[#1d2327] m-0">{title}</h2>}
          {description && <p className="text-[13px] text-[#646970] mt-1 m-0">{description}</p>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

export function FormGrid({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={twMerge("grid md:grid-cols-2 gap-x-6 gap-y-4", className)}>{children}</div>;
}

export function FormField({ label, children, className }: { label: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={twMerge("mb-2", className)}>
      <label className="text-[14px] font-semibold text-[#2c3338] block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { dir?: "rtl" | "ltr" }) {
  return (
    <input 
      {...props} 
      className={twMerge(
        "w-full bg-white border border-[#8c8f94] px-2 py-[3px] min-h-[30px] text-[14px] text-[#2c3338] shadow-[inset_0_1px_2px_rgba(0,0,0,0.07)] rounded-[3px] focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] focus:outline-none transition-none",
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
        "w-full bg-white border border-[#8c8f94] px-2 py-[3px] text-[14px] text-[#2c3338] shadow-[inset_0_1px_2px_rgba(0,0,0,0.07)] rounded-[3px] focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] focus:outline-none transition-none resize-y",
        props.dir === "ltr" && "text-left",
        props.className
      )} 
    />
  );
}

export function Button({ children, variant = 'primary', className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'danger' | 'ghost' }) {
  const base = "inline-flex items-center justify-center gap-2 px-[10px] py-[2px] min-h-[30px] text-[13px] rounded-[3px] transition-none disabled:opacity-50 border cursor-pointer align-top whitespace-nowrap";
  const variants = {
    primary: "bg-[#2271b1] border-[#2271b1] text-white hover:bg-[#135e96] hover:border-[#135e96]",
    outline: "bg-[#f6f7f7] border-[#2271b1] text-[#2271b1] hover:bg-[#f0f0f1] hover:text-[#135e96] hover:border-[#135e96]",
    danger: "bg-white border-[#dcdcde] text-[#d63638] hover:bg-[#f0f0f1] hover:text-[#d63638]",
    ghost: "bg-transparent border-transparent text-[#2271b1] hover:text-[#135e96] shadow-none"
  };
  return <button {...props} className={twMerge(base, variants[variant], className)}>{children}</button>;
}
