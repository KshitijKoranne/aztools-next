import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Word Cloud Generator",
  description: "Generate a downloadable word cloud from text.",
  alternates: { canonical: "https://aztools.in/tools/word-cloud-generator" },
};

export default function WordCloudGeneratorPage() {
  return <Client />;
}
