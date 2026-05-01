import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { jsonLd, publisherName, siteName, siteUrl } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  referrer: "origin-when-cross-origin",
  category: "technology",
  title: {
    default: "AZ Tools - Free Online Tools for PDF, Images, Text, Developers & SEO",
    template: "%s | AZ Tools",
  },
  description:
    "Use 95+ free online tools for PDF processing, image editing, text utilities, developer tools, calculators, SEO, security, finance, and productivity. Fast, browser-friendly, and privacy-focused.",
  keywords: [
    "online tools",
    "developer tools",
    "PDF tools",
    "image converter",
    "text formatter",
    "JSON formatter",
    "color tools",
    "calculators",
    "code beautifier",
    "password generator",
    "SEO tools",
    "web utilities",
    "free online tools",
  ],
  authors: [{ name: publisherName }],
  creator: publisherName,
  publisher: publisherName,
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: "AZ Tools - Free Online Tools for PDF, Images, Text, Developers & SEO",
    description:
      "Use 95+ free online tools for PDF processing, image editing, text utilities, developer tools, calculators, SEO, security, finance, and productivity.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AZ Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AZ Tools - Free Online Tools for PDF, Images, Text, Developers & SEO",
    description:
      "Use 95+ free online tools for PDF, image, text, developer, calculator, SEO, security, finance, and productivity tasks.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: publisherName,
      url: siteUrl,
      logo: `${siteUrl}/android-chrome-512x512.png`,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: siteName,
      url: siteUrl,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: publisherName },
    },
  ];

  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={jsonLd(structuredData)}
          />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
