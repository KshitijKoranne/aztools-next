import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Investment Calculator",
  description:
    "Free investment calculator for projecting future value with monthly contributions, annual returns, and strategy scenarios.",
  keywords: ["investment calculator", "future value calculator", "return calculator", "wealth calculator"],
  alternates: { canonical: "https://aztools.in/tools/investment-calculator" },
  openGraph: {
    title: "Investment Calculator - AZ Tools",
    description: "Project investment growth, contributions, interest earned, and future balance over time.",
    url: "https://aztools.in/tools/investment-calculator",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
