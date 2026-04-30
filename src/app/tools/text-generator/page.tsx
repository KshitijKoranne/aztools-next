import type { Metadata } from "next";
import TextGeneratorClient from "./client";

export const metadata: Metadata = {
  title: "Text Generator",
  description:
    "Free online random text generator. Generate random strings with custom length and character sets, or create randomized lists from your own items.",
  keywords: [
    "random text generator",
    "random string generator",
    "random list generator",
    "password generator",
    "random character generator",
    "online text tool",
  ],
  alternates: { canonical: "https://aztools.in/tools/text-generator" },
  openGraph: {
    title: "Text Generator - AZ Tools",
    description:
      "Generate random strings with custom character sets, or randomize lists from your own items — instant, in-browser.",
    url: "https://aztools.in/tools/text-generator",
    type: "website",
  },
};

export default function TextGeneratorPage() {
  return <TextGeneratorClient />;
}
