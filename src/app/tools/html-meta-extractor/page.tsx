import type { Metadata } from "next";
import HtmlMetaExtractorClient from "./client";

export const metadata: Metadata = {
  title: "HTML Meta Extractor",
  description: "Extract title, meta tags, Open Graph data, Twitter cards, canonicals, and icons from HTML.",
  alternates: { canonical: "https://aztools.in/tools/html-meta-extractor" },
};

export default function HtmlMetaExtractorPage() {
  return <HtmlMetaExtractorClient />;
}
