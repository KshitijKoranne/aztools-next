import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Random Number Generator",
  description: "Free random number generator for integers, decimals, and number lists with custom ranges.",
  alternates: { canonical: "https://aztools.in/tools/random-number-generator" },
  openGraph: {
    title: "Random Number Generator - AZ Tools",
    description: "Generate random integers, decimals, and number lists.",
    url: "https://aztools.in/tools/random-number-generator",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
