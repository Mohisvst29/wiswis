import "./(dashboard)/admin.css";
import React from "react";

export const metadata = {
  title: "لوحة تحكم وسوس",
  description: "Admin Panel",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-50 text-gray-900 font-sans m-0 antialiased">
        {children}
      </body>
    </html>
  );
}
