import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Robots.txt Generator",
  description: "Generate robots.txt directives with disallow paths and sitemap URL.",
  alternates: { canonical: "https://aztools.in/tools/robots-txt-generator" },
};

export default function RobotsTxtGeneratorPage() {
  return <Client />;
}
