import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "IP Address Lookup",
  description: "Free IP address lookup tool for location, ISP, timezone, and private IP range checks.",
  alternates: { canonical: "https://aztools.in/tools/ip-address-lookup" },
  openGraph: {
    title: "IP Address Lookup - AZ Tools",
    description: "Look up public IP information and review common private IPv4 ranges.",
    url: "https://aztools.in/tools/ip-address-lookup",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
