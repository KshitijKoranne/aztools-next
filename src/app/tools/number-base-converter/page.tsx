import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Number Base Converter",
  description: "Convert numbers between decimal, binary, hexadecimal, and octal bases with grouped output.",
  keywords: ["number base converter", "binary converter", "hex converter", "decimal converter"],
  alternates: { canonical: "https://aztools.in/tools/number-base-converter" },
  openGraph: { title: "Number Base Converter - AZ Tools", description: "Convert numbers between binary, decimal, hex, and octal.", url: "https://aztools.in/tools/number-base-converter", type: "website" },
};

export default function Page() {
  return <Client />;
}
