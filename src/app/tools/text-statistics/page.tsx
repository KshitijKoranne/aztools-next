import type { Metadata } from "next";
import TextStatisticsClient from "./client";

export const metadata: Metadata = {
  title: "Text Statistics",
  description:
    "Free online text statistics analyzer. Get word count, character count, sentence count, reading time, readability score, and most common words instantly.",
  keywords: [
    "text statistics",
    "word count",
    "character count",
    "reading time",
    "readability score",
    "text analyzer",
    "Flesch reading ease",
  ],
  alternates: { canonical: "https://aztools.in/tools/text-statistics" },
  openGraph: {
    title: "Text Statistics - AZ Tools",
    description:
      "Analyze word count, reading time, readability, and more — instant, in-browser text statistics.",
    url: "https://aztools.in/tools/text-statistics",
    type: "website",
  },
};

export default function TextStatisticsPage() {
  return <TextStatisticsClient />;
}
