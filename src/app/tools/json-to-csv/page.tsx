import type { Metadata } from "next";
import JsonToCsvClient from "./client";

export const metadata: Metadata = {
  title: "JSON to CSV Converter",
  description: "Convert JSON arrays and objects into CSV with custom delimiter and flattening options.",
  alternates: { canonical: "https://aztools.in/tools/json-to-csv" },
};

export default function JsonToCsvPage() {
  return <JsonToCsvClient />;
}
