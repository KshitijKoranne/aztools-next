import type { Metadata } from "next";
import TextDiffClient from "./client";

export const metadata: Metadata = {
  title: "Text Diff",
  description:
    "Free online text diff tool. Compare two texts and see added, removed, and unchanged lines highlighted side by side.",
  keywords: [
    "text diff",
    "compare text",
    "text comparison",
    "find differences",
    "line diff",
    "online diff tool",
  ],
  alternates: { canonical: "https://aztools.in/tools/text-diff" },
  openGraph: {
    title: "Text Diff - AZ Tools",
    description:
      "Compare two texts instantly. See added, removed, and unchanged lines highlighted — no login required.",
    url: "https://aztools.in/tools/text-diff",
    type: "website",
  },
};

export default function TextDiffPage() {
  return <TextDiffClient />;
}
