import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "QR Code Decoder",
  description: "Free QR code decoder for reading QR codes from uploaded images in supported browsers.",
  alternates: { canonical: "https://aztools.in/tools/qr-code-decoder" },
  openGraph: {
    title: "QR Code Decoder - AZ Tools",
    description: "Decode QR codes from uploaded images using your browser.",
    url: "https://aztools.in/tools/qr-code-decoder",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
