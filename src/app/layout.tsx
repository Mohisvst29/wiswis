import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/components/LangProvider";
import DynamicStyles from "@/components/DynamicStyles";

export const metadata: Metadata = {
  title: "Wiswis Petroleum Services | وسوس لخدمات الوقود",
  description: "Integrated fuel and roadside services with global standards. حلول متكاملة لخدمات الوقود والطريق بمعايير عالمية.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800&family=IBM+Plex+Sans+Arabic:wght@400;600;700&family=Inter:wght@400;500;700&family=Poppins:wght@400;600;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <DynamicStyles />
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
