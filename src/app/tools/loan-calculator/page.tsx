import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Loan Calculator",
  description:
    "Free loan calculator for monthly, bi-weekly, and weekly payments with total interest and amortization summary.",
  keywords: ["loan calculator", "mortgage calculator", "amortization calculator", "payment calculator"],
  alternates: { canonical: "https://aztools.in/tools/loan-calculator" },
  openGraph: {
    title: "Loan Calculator - AZ Tools",
    description: "Calculate loan payments, total interest, total repayment, and balance over time.",
    url: "https://aztools.in/tools/loan-calculator",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
