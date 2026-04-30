import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Percentage Calculator",
  description:
    "Free percentage calculator for percentage of a value, percentage change, percentage points, increases, decreases, and reverse percentages.",
  keywords: [
    "percentage calculator",
    "percent calculator",
    "percentage change calculator",
    "percentage increase calculator",
    "percentage decrease calculator",
  ],
  alternates: { canonical: "https://aztools.in/tools/percentage-calculator" },
  openGraph: {
    title: "Percentage Calculator - AZ Tools",
    description:
      "Calculate percentages, changes, percentage points, increases, decreases, and reverse percentages instantly.",
    url: "https://aztools.in/tools/percentage-calculator",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
