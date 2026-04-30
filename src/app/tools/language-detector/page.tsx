import type { Metadata } from "next";
import LanguageDetectorClient from "./client";

export const metadata: Metadata = {
  title: "Language Detector",
  description:
    "Free online language detection tool. Paste any text and instantly detect which language it is written in.",
  keywords: [
    "language detector",
    "detect language",
    "language identification",
    "text language",
    "online language tool",
  ],
  alternates: { canonical: "https://aztools.in/tools/language-detector" },
  openGraph: {
    title: "Language Detector - AZ Tools",
    description:
      "Paste any text and instantly detect its language — no login, runs in browser.",
    url: "https://aztools.in/tools/language-detector",
    type: "website",
  },
};

export default function LanguageDetectorPage() {
  return <LanguageDetectorClient />;
}
