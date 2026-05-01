import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Favicon Generator",
  description: "Generate common PNG favicon sizes from an uploaded image.",
  alternates: { canonical: "https://aztools.in/tools/favicon-generator" },
};

export default function FaviconGeneratorPage() {
  return <Client />;
}
