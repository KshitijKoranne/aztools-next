import type { Metadata } from "next";
import SlugGeneratorClient from "./client";

export const metadata: Metadata = {
  title: "Slug Generator",
  description: "Generate clean URL slugs from titles, headings, product names, and page names.",
  alternates: { canonical: "https://aztools.in/tools/slug-generator" },
};

export default function SlugGeneratorPage() {
  return <SlugGeneratorClient />;
}
