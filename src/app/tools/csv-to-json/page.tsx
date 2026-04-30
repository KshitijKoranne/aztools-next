import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "CSV to JSON Converter",
  description: "Convert CSV data to JSON with delimiter, header, and formatting options.",
  alternates: { canonical: "https://aztools.in/tools/csv-to-json" },
};

export default function CsvToJsonPage() {
  return <Client />;
}
