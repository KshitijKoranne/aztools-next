import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Sitemap Generator",
  description: "Generate XML sitemap files from URL lists.",
  alternates: { canonical: "https://aztools.in/tools/sitemap-generator" },
};

export default function SitemapGeneratorPage() {
  return <Client />;
}
