import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Bulk File Renamer",
  description: "Rename multiple files with sequential, prefix, suffix, and find-replace rules.",
  alternates: { canonical: "https://aztools.in/tools/bulk-file-renamer" },
};

export default function BulkFileRenamerPage() {
  return <Client />;
}
