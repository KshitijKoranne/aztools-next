import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Discount Calculator",
  description:
    "Free discount calculator for simple discounts, stacked discounts, reverse discounts, and deal comparisons.",
  keywords: ["discount calculator", "sale price calculator", "stacked discount calculator", "reverse discount"],
  alternates: { canonical: "https://aztools.in/tools/discount-calculator" },
  openGraph: {
    title: "Discount Calculator - AZ Tools",
    description: "Calculate final prices, savings, stacked discounts, reverse discounts, and compare deals instantly.",
    url: "https://aztools.in/tools/discount-calculator",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
