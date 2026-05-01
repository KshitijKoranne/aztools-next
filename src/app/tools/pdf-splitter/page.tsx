import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "PDF Splitter",
  description: "Extract a page range from a PDF in your browser.",
  alternates: { canonical: "https://aztools.in/tools/pdf-splitter" },
};

export default function PdfSplitterPage() {
  return <Client />;
}
