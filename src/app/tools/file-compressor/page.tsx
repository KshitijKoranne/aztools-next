import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "File Compressor",
  description: "Compress multiple files into a downloadable tar.gz archive in your browser.",
  alternates: { canonical: "https://aztools.in/tools/file-compressor" },
};

export default function FileCompressorPage() {
  return <Client />;
}
