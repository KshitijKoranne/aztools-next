import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Delete PDF Pages",
  description: "Remove selected pages from a PDF file locally in your browser.",
  keywords: ["delete pdf pages", "remove pdf pages", "pdf page remover"],
  alternates: { canonical: "https://aztools.in/tools/pdf-delete-pages" },
  openGraph: { title: "Delete PDF Pages - AZ Tools", description: "Remove selected pages from a PDF in your browser.", url: "https://aztools.in/tools/pdf-delete-pages", type: "website" },
};

export default function Page() {
  return <Client />;
}
