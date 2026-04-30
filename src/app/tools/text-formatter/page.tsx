import type { Metadata } from "next";
import TextFormatterClient from "./client";

export const metadata: Metadata = {
  title: "Text Formatter",
  description:
    "Free online text formatter. Clean up whitespace, change case (UPPER, lower, Title, Sentence, camelCase, snake_case, kebab-case), sort lines, remove duplicates.",
  keywords: [
    "text formatter",
    "case converter",
    "title case",
    "camelCase",
    "snake_case",
    "kebab-case",
    "remove duplicate lines",
    "sort lines",
    "online text tool",
  ],
  alternates: { canonical: "https://aztools.in/tools/text-formatter" },
  openGraph: {
    title: "Text Formatter - AZ Tools",
    description:
      "Clean whitespace, change case, sort lines, remove duplicates — instant text formatting in your browser.",
    url: "https://aztools.in/tools/text-formatter",
    type: "website",
  },
};

export default function TextFormatterPage() {
  return <TextFormatterClient />;
}
