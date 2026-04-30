import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Random String Generator",
  description: "Free random string generator for custom character sets, bulk strings, and pronounceable words.",
  alternates: { canonical: "https://aztools.in/tools/random-string-generator" },
  openGraph: {
    title: "Random String Generator - AZ Tools",
    description: "Generate random strings, IDs, tokens, and pronounceable words.",
    url: "https://aztools.in/tools/random-string-generator",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
