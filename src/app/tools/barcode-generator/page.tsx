import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Barcode Generator",
  description: "Generate and download scannable Code 39 barcodes as SVG.",
  alternates: { canonical: "https://aztools.in/tools/barcode-generator" },
};

export default function BarcodeGeneratorPage() {
  return <Client />;
}
