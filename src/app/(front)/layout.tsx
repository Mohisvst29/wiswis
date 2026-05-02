import type { Metadata } from "next";
import "../globals.css";
import { LangProvider } from "@/components/LangProvider";
import DynamicStyles from "@/components/DynamicStyles";
import FloatingActions from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "شركة وسوس للتجارة | Wiswis Trading Company",
  description: "شركة وسوس للتجارة - حلول متكاملة للتجارة والخدمات بمعايير عالمية في المملكة العربية السعودية. Wiswis Trading Company - Integrated trading and services in Saudi Arabia.",
  keywords: ["وسوس", "شركة وسوس للتجارة", "تجارة", "خدمات", "السعودية", "Wiswis", "trading", "company", "Saudi Arabia"],
  authors: [{ name: "Wiswis Trading Company" }],
  openGraph: {
    title: "شركة وسوس للتجارة | Wiswis Trading Company",
    description: "شركة وسوس للتجارة - حلول متكاملة للتجارة والخدمات بمعايير عالمية في المملكة العربية السعودية",
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
    siteName: "Wiswis Trading Company",
  },
  twitter: {
    card: "summary_large_image",
    title: "شركة وسوس للتجارة | Wiswis Trading Company",
    description: "شركة وسوس للتجارة - حلول متكاملة للتجارة والخدمات بمعايير عالمية",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800&family=IBM+Plex+Sans+Arabic:wght@400;600;700&family=Inter:wght@400;500;700&family=Poppins:wght@400;600;800&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <DynamicStyles />
        <LangProvider>
          {children}
          <FloatingActions />
        </LangProvider>

        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "شركة وسوس للتجارة",
              "alternateName": "Wiswis Trading Company",
              "description": "شركة وسوس للتجارة - حلول متكاملة للتجارة والخدمات بمعايير عالمية في المملكة العربية السعودية",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+966554460672",
                "contactType": "customer service",
                "areaServed": "SA",
                "availableLanguage": ["Arabic", "English"]
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "SA"
              },
              "sameAs": []
            })
          }}
        />
      </body>
    </html>
  );
}
