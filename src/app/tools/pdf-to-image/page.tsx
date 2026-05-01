import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "PDF to Image",
  description: "Render a PDF page to a downloadable PNG image.",
  alternates: { canonical: "https://aztools.in/tools/pdf-to-image" },
};

export default function PdfToImagePage() {
  return <Client />;
}
