import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "HTML Entity Encoder and Decoder",
  description: "Encode text into HTML entities or decode HTML entities back to readable text with browser-side processing.",
  keywords: ["html entity encoder", "html entity decoder", "escape html", "decode html"],
  alternates: { canonical: "https://aztools.in/tools/html-entity-converter" },
  openGraph: {
    title: "HTML Entity Encoder and Decoder - AZ Tools",
    description: "Encode and decode HTML entities safely in your browser.",
    url: "https://aztools.in/tools/html-entity-converter",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
