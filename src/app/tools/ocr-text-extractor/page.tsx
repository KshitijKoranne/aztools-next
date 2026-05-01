import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "OCR Text Extractor",
  description: "Extract text from images using browser OCR.",
  alternates: { canonical: "https://aztools.in/tools/ocr-text-extractor" },
};

export default function OcrTextExtractorPage() {
  return <Client />;
}
