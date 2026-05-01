import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "PDF Merger",
  description: "Merge multiple PDF files into one PDF in your browser.",
  alternates: { canonical: "https://aztools.in/tools/pdf-merger" },
};

export default function PdfMergerPage() {
  return <Client />;
}
