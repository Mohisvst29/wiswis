"use client";
import React, { ReactNode } from "react";
import { LocaleProvider } from "@/hooks/useLocale";

export default function ClientBody({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <body className="antialiased">
        {children}
      </body>
    </LocaleProvider>
  );
}
