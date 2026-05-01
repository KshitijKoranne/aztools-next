import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator",
  description: "Generate placeholder words, sentences, and paragraphs.",
  alternates: { canonical: "https://aztools.in/tools/lorem-ipsum-generator" },
};

export default function LoremIpsumGeneratorPage() {
  return <Client />;
}
