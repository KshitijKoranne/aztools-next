import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Keyword Density Checker",
  description: "Analyze keyword frequency, density, and top terms in page content.",
  alternates: { canonical: "https://aztools.in/tools/keyword-density" },
};

export default function KeywordDensityPage() {
  return <Client />;
}
