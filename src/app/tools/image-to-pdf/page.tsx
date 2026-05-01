import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Image to PDF",
  description: "Convert images into a PDF document in your browser.",
  alternates: { canonical: "https://aztools.in/tools/image-to-pdf" },
};

export default function ImageToPdfPage() {
  return <Client />;
}
