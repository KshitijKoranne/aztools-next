import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "CIDR Calculator",
  description: "Calculate IPv4 CIDR network ranges, subnet masks, broadcast addresses, and usable host counts.",
  keywords: ["cidr calculator", "subnet calculator", "ip range calculator", "network calculator"],
  alternates: { canonical: "https://aztools.in/tools/cidr-calculator" },
  openGraph: {
    title: "CIDR Calculator - AZ Tools",
    description: "Calculate IPv4 subnet ranges, masks, and host counts.",
    url: "https://aztools.in/tools/cidr-calculator",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
