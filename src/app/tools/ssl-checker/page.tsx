import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "SSL Certificate Checker",
  description: "Free SSL certificate checker for validity, issuer, subject, SANs, and expiration date.",
  alternates: { canonical: "https://aztools.in/tools/ssl-checker" },
  openGraph: {
    title: "SSL Certificate Checker - AZ Tools",
    description: "Check SSL certificate validity, issuer, subject, and expiration details.",
    url: "https://aztools.in/tools/ssl-checker",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
