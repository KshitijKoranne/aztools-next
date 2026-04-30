import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Network Speed Test",
  description: "Free browser network speed test for download speed, latency, and connection timing.",
  alternates: { canonical: "https://aztools.in/tools/network-speed-test" },
  openGraph: {
    title: "Network Speed Test - AZ Tools",
    description: "Estimate download speed and latency directly from your browser.",
    url: "https://aztools.in/tools/network-speed-test",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
