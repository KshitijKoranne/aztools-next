import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "PDF Rotator",
  description: "Rotate all pages in a PDF and download the result.",
  alternates: { canonical: "https://aztools.in/tools/pdf-rotator" },
};

export default function PdfRotatorPage() {
  return <Client />;
}
