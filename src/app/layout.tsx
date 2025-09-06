import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AZ Tools - Professional Online Toolkit for Everyone",
  description: "Transform your workflow with 60+ professional-grade online tools. PDF processing, image editing, text utilities, developer tools, calculators & more. Free, fast, and privacy-focused.",
  keywords: [
    'online tools',
    'developer tools', 
    'PDF tools',
    'image converter',
    'text formatter',
    'JSON formatter',
    'color tools',
    'calculators',
    'code beautifier',
    'password generator',
    'SEO tools',
    'web utilities',
    'professional toolkit',
    'free online tools',
    'browser tools'
  ],
  authors: [{ name: 'KSK Labs' }],
  openGraph: {
    title: 'AZ Tools - Professional Online Toolkit',
    description: 'Transform your workflow with 60+ professional-grade online tools. Free, fast, and privacy-focused.',
    type: 'website',
    locale: 'en_US',
    siteName: 'AZ Tools'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AZ Tools - Professional Online Toolkit',
    description: 'Transform your workflow with 60+ professional-grade online tools.'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
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
