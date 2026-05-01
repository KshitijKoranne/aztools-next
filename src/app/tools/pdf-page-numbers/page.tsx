import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF",
  description: "Add customizable page numbers to a PDF with position, size, color, and format controls.",
  keywords: ["add page numbers to pdf", "pdf page numbering", "number pdf pages"],
  alternates: { canonical: "https://aztools.in/tools/pdf-page-numbers" },
  openGraph: { title: "Add Page Numbers to PDF - AZ Tools", description: "Add page numbers to PDFs in your browser.", url: "https://aztools.in/tools/pdf-page-numbers", type: "website" },
};

export default function Page() {
  return <Client />;
}
