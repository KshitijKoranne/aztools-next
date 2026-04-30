import type { Metadata } from "next";
import GitignoreGeneratorClient from "./client";
export const metadata: Metadata = {
  title: ".gitignore Generator",
  description: "Free online .gitignore generator. Select from Node.js, Python, Java, React, Go, Rust, and OS templates to generate a .gitignore file instantly.",
  keywords: ["gitignore generator","gitignore template","generate gitignore","git ignore file","gitignore nodejs python"],
  alternates: { canonical: "https://aztools.in/tools/gitignore-generator" },
  openGraph: { title: ".gitignore Generator - AZ Tools", description: "Generate .gitignore files for any stack — Node, Python, Java, React, Go, and more.", url: "https://aztools.in/tools/gitignore-generator", type: "website" },
};
export default function Page() { return <GitignoreGeneratorClient />; }
