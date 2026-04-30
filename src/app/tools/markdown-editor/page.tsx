import type { Metadata } from "next";
import MarkdownEditorClient from "./client";

export const metadata: Metadata = {
  title: "Markdown Editor",
  description:
    "Free online markdown editor with live preview. Write markdown and see the rendered HTML instantly. Export as .md or .html.",
  keywords: [
    "markdown editor",
    "markdown preview",
    "markdown to html",
    "online markdown",
    "live preview editor",
  ],
  alternates: { canonical: "https://aztools.in/tools/markdown-editor" },
  openGraph: {
    title: "Markdown Editor - AZ Tools",
    description:
      "Write markdown with live preview. Instantly see rendered output and export as .md or .html.",
    url: "https://aztools.in/tools/markdown-editor",
    type: "website",
  },
};

export default function MarkdownEditorPage() {
  return <MarkdownEditorClient />;
}
