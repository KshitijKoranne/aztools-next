import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Reverse PDF Pages",
  description: "Reverse the page order of a PDF file locally in your browser.",
  keywords: ["reverse pdf pages", "pdf page order", "reorder pdf"],
  alternates: { canonical: "https://aztools.in/tools/pdf-reverse-pages" },
  openGraph: { title: "Reverse PDF Pages - AZ Tools", description: "Reverse PDF page order in your browser.", url: "https://aztools.in/tools/pdf-reverse-pages", type: "website" },
};

export default function Page() {
  return <Client />;
}
