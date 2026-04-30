import type { Metadata } from "next";
import DuplicateLineRemoverClient from "./client";

export const metadata: Metadata = {
  title: "Duplicate Line Remover",
  description:
    "Free online duplicate line remover. Paste text and instantly remove duplicate lines. Options for case sensitivity, order preservation, and empty line handling.",
  keywords: [
    "duplicate line remover",
    "remove duplicate lines",
    "deduplicate text",
    "unique lines",
    "text cleaner",
  ],
  alternates: { canonical: "https://aztools.in/tools/duplicate-line-remover" },
  openGraph: {
    title: "Duplicate Line Remover - AZ Tools",
    description:
      "Remove duplicate lines from any text. Case-sensitive or insensitive, preserve order or sort — instant, in-browser.",
    url: "https://aztools.in/tools/duplicate-line-remover",
    type: "website",
  },
};

export default function DuplicateLineRemoverPage() {
  return <DuplicateLineRemoverClient />;
}
