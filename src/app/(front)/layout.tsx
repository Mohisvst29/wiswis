import type { Metadata } from "next";
import "../globals.css";
import { LangProvider } from "@/components/LangProvider";
import DynamicStyles from "@/components/DynamicStyles";
import FloatingActions from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "وسوس لخدمات الوقود | Wiswis Petroleum Services",
  description: "وسوس لخدمات الوقود - حلول متكاملة لمحطات الوقود وخدمات الطريق بمعايير عالمية. محطات وقود، غسيل سيارات، سوبر ماركت، صيانة، ومقاهي متخصصة في المملكة العربية السعودية. Wiswis Petroleum - Integrated fuel stations and roadside services in Saudi Arabia.",
  keywords: ["وسوس", "محطات وقود", "خدمات الوقود", "وقود", "غسيل سيارات", "سوبر ماركت", "صيانة سيارات", "محطات بنزين", "السعودية", "Wiswis", "petroleum", "fuel stations", "car wash", "Saudi Arabia"],
  authors: [{ name: "Wiswis Petroleum Services" }],
  openGraph: {
    title: "وسوس لخدمات الوقود | Wiswis Petroleum Services",
    description: "حلول متكاملة لمحطات الوقود وخدمات الطريق بمعايير عالمية في المملكة العربية السعودية",
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
    siteName: "Wiswis Petroleum",
  },
  twitter: {
    card: "summary_large_image",
    title: "وسوس لخدمات الوقود | Wiswis Petroleum Services",
    description: "حلول متكاملة لمحطات الوقود وخدمات الطريق بمعايير عالمية",
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
              "name": "وسوس لخدمات الوقود",
              "alternateName": "Wiswis Petroleum Services",
              "description": "حلول متكاملة لمحطات الوقود وخدمات الطريق بمعايير عالمية في المملكة العربية السعودية",
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
