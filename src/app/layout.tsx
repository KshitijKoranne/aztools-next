import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://aztools.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AZ Tools - Professional Online Toolkit for Everyone",
    template: "%s | AZ Tools",
  },
  description:
    "Transform your workflow with 90+ professional-grade online tools. PDF processing, image editing, text utilities, developer tools, calculators & more. Free, fast, privacy-focused.",
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
  authors: [{ name: "KSK Labs" }],
  creator: "KSK Labs",
  publisher: "KSK Labs",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "AZ Tools",
    title: "AZ Tools - Professional Online Toolkit for Everyone",
    description:
      "Transform your workflow with 90+ professional-grade online tools. Free, fast, privacy-focused.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AZ Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AZ Tools - Professional Online Toolkit for Everyone",
    description:
      "Transform your workflow with 90+ professional-grade online tools. Free, fast, privacy-focused.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
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
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
