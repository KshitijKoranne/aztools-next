import type { Metadata } from "next";
import Client from "./client";
export const metadata: Metadata = {
  title: "Tip Calculator",
  description: "Free tip calculator. Calculate tip amount, total bill, and per-person split for any bill size and tip percentage.",
  keywords: ["tip calculator","bill splitter","gratuity calculator","restaurant calculator"],
  alternates: { canonical: "https://aztools.in/tools/tip-calculator" },
  openGraph: { title: "Tip Calculator - AZ Tools", description: "Free tip calculator. Calculate tip amount, total bill, and per-person split for any bill size and tip percentage.", url: "https://aztools.in/tools/tip-calculator", type: "website" },
};
export default function Page() { return <Client />; }
