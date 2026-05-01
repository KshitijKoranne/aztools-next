import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Meta Tags Generator",
  description: "Generate primary, Open Graph, and Twitter meta tags for web pages.",
  alternates: { canonical: "https://aztools.in/tools/meta-tags-generator" },
};

export default function MetaTagsGeneratorPage() {
  return <Client />;
}
