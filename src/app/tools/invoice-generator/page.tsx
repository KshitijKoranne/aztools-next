import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Simple Invoice Generator",
  description: "Create, preview, copy, and download simple invoices in your browser.",
  alternates: { canonical: "https://aztools.in/tools/invoice-generator" },
};

export default function InvoiceGeneratorPage() {
  return <Client />;
}
