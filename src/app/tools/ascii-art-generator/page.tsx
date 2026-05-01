import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "ASCII Art Generator",
  description: "Convert text or images into copyable ASCII art.",
  alternates: { canonical: "https://aztools.in/tools/ascii-art-generator" },
};

export default function AsciiArtGeneratorPage() {
  return <Client />;
}
