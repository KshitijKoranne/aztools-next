import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Crypto Price Checker",
  description: "Check live crypto spot prices for popular assets using a free public Coinbase price API.",
  keywords: ["crypto price checker", "bitcoin price", "ethereum price", "coinbase price api"],
  alternates: { canonical: "https://aztools.in/tools/crypto-price-checker" },
  openGraph: {
    title: "Crypto Price Checker - AZ Tools",
    description: "Check live crypto spot prices for popular assets.",
    url: "https://aztools.in/tools/crypto-price-checker",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
