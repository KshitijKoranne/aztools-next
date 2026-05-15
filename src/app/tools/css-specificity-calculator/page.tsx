import type { Metadata } from "next";
import CssSpecificityCalculatorClient from "./client";

export const metadata: Metadata = {
  title: "CSS Specificity Calculator",
  description: "Calculate and compare CSS selector specificity.",
  alternates: { canonical: "https://aztools.in/tools/css-specificity-calculator" },
};

export default function CssSpecificityCalculatorPage() {
  return <CssSpecificityCalculatorClient />;
}
