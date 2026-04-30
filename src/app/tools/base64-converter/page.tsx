import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Base64 Converter",
  description: "Free Base64 encoder and decoder for text and files with URL-safe output options.",
  alternates: { canonical: "https://aztools.in/tools/base64-converter" },
  openGraph: {
    title: "Base64 Converter - AZ Tools",
    description: "Encode and decode Base64 strings and files in your browser.",
    url: "https://aztools.in/tools/base64-converter",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
