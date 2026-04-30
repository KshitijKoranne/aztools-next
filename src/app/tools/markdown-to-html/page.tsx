import type { Metadata } from "next";
import MarkdownToHtmlClient from "./client";
export const metadata: Metadata = {
  title: "Markdown to HTML Converter",
  description: "Free online Markdown to HTML converter with live preview. Upload .md files or paste markdown and get clean HTML output with optional CSS styles.",
  keywords: ["markdown to html","convert markdown","markdown converter","md to html","markdown preview"],
  alternates: { canonical: "https://aztools.in/tools/markdown-to-html" },
  openGraph: { title: "Markdown to HTML Converter - AZ Tools", description: "Convert Markdown to HTML with live preview and optional CSS styles.", url: "https://aztools.in/tools/markdown-to-html", type: "website" },
};
export default function Page() { return <MarkdownToHtmlClient />; }
