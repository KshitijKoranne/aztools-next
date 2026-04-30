import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "DNS Lookup Tool",
  description: "Free DNS lookup tool for A, AAAA, CNAME, MX, NS, TXT, and SOA records.",
  alternates: { canonical: "https://aztools.in/tools/dns-lookup" },
  openGraph: {
    title: "DNS Lookup Tool - AZ Tools",
    description: "Query DNS records for any domain using DNS over HTTPS.",
    url: "https://aztools.in/tools/dns-lookup",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
