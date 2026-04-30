import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Currency Converter",
  description: "Convert between popular currencies using live public exchange rates.",
  alternates: { canonical: "https://aztools.in/tools/currency-converter" },
};

export default function CurrencyConverterPage() {
  return <Client />;
}
