import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "MAC Vendor Lookup",
  description: "Find the manufacturer or vendor registered to a MAC address or OUI prefix using a free lookup API.",
  keywords: ["mac vendor lookup", "mac address lookup", "oui lookup", "network vendor lookup"],
  alternates: { canonical: "https://aztools.in/tools/mac-vendor-lookup" },
  openGraph: {
    title: "MAC Vendor Lookup - AZ Tools",
    description: "Find the vendor registered to a MAC address or OUI prefix.",
    url: "https://aztools.in/tools/mac-vendor-lookup",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
