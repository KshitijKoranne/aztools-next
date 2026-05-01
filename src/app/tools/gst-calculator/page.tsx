import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "GST Calculator",
  description: "Calculate GST inclusive and exclusive prices with CGST, SGST, and IGST splits for Indian invoices.",
  keywords: ["gst calculator", "india gst calculator", "cgst sgst calculator", "igst calculator"],
  alternates: { canonical: "https://aztools.in/tools/gst-calculator" },
  openGraph: {
    title: "GST Calculator - AZ Tools",
    description: "Calculate GST amounts, totals, and tax splits for Indian billing.",
    url: "https://aztools.in/tools/gst-calculator",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
