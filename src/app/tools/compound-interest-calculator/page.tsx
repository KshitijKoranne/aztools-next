import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Compound Interest Calculator",
  description:
    "Free compound interest calculator for projecting investment growth with contributions, compounding frequency, and currency formatting.",
  keywords: ["compound interest calculator", "investment growth calculator", "interest calculator", "savings calculator"],
  alternates: { canonical: "https://aztools.in/tools/compound-interest-calculator" },
  openGraph: {
    title: "Compound Interest Calculator - AZ Tools",
    description: "Project compound interest, total contributions, interest earned, and yearly investment growth.",
    url: "https://aztools.in/tools/compound-interest-calculator",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
