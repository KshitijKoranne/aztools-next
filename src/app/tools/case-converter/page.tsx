import type { Metadata } from "next";
import CaseConverterClient from "./client";

export const metadata: Metadata = {
  title: "Case Converter",
  description:
    "Free online case converter. Convert text to sentence case, lowercase, UPPERCASE, Title Case, camelCase, alternating case, and inverse case instantly.",
  keywords: [
    "case converter",
    "uppercase",
    "lowercase",
    "title case",
    "sentence case",
    "alternating case",
    "text case tool",
  ],
  alternates: { canonical: "https://aztools.in/tools/case-converter" },
  openGraph: {
    title: "Case Converter - AZ Tools",
    description:
      "Convert text between sentence case, lowercase, UPPERCASE, Title Case, and more — instantly in your browser.",
    url: "https://aztools.in/tools/case-converter",
    type: "website",
  },
};

export default function CaseConverterPage() {
  return <CaseConverterClient />;
}
