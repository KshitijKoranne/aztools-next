import type { Metadata } from "next";
import WordFrequencyClient from "./client";

export const metadata: Metadata = {
  title: "Word Frequency Analyzer",
  description:
    "Free online word frequency analyzer. Find the most common words in any text. Filter stop words, set minimum word length, and export results as CSV.",
  keywords: [
    "word frequency",
    "word count",
    "text analysis",
    "keyword frequency",
    "stop words filter",
    "word analyzer",
  ],
  alternates: { canonical: "https://aztools.in/tools/word-frequency" },
  openGraph: {
    title: "Word Frequency Analyzer - AZ Tools",
    description:
      "Find the most common words in any text. Filter stop words, export as CSV.",
    url: "https://aztools.in/tools/word-frequency",
    type: "website",
  },
};

export default function WordFrequencyPage() {
  return <WordFrequencyClient />;
}
