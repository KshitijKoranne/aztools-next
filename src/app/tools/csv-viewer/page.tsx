import type { Metadata } from "next";
import CsvViewerClient from "./client";
export const metadata: Metadata = {
  title: "CSV Viewer",
  description: "Free online CSV viewer. Upload a CSV file and view it as a searchable, paginated table. Filter rows and download results.",
  keywords: ["csv viewer","csv table","view csv online","csv reader","csv parser"],
  alternates: { canonical: "https://aztools.in/tools/csv-viewer" },
  openGraph: { title: "CSV Viewer - AZ Tools", description: "Upload CSV files and view them as searchable, paginated tables — in-browser.", url: "https://aztools.in/tools/csv-viewer", type: "website" },
};
export default function Page() { return <CsvViewerClient />; }
