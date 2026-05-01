import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "PDF Text Extractor",
  description: "Extract selectable text from PDF files in your browser.",
  alternates: { canonical: "https://aztools.in/tools/pdf-text-extractor" },
};

export default function PdfTextExtractorPage() {
  return <Client />;
}
