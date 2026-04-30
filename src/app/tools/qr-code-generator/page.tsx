import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "QR Code Generator",
  description: "Free QR code generator for URLs, text, email, phone, SMS, and Wi-Fi details.",
  alternates: { canonical: "https://aztools.in/tools/qr-code-generator" },
  openGraph: {
    title: "QR Code Generator - AZ Tools",
    description: "Create downloadable QR codes for links, text, contact actions, and Wi-Fi.",
    url: "https://aztools.in/tools/qr-code-generator",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
