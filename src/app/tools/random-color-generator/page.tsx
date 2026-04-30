import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Random Color Generator",
  description: "Free random color generator for HEX, RGB, HSL, and color palette generation.",
  alternates: { canonical: "https://aztools.in/tools/random-color-generator" },
  openGraph: {
    title: "Random Color Generator - AZ Tools",
    description: "Generate random colors and palettes with HEX, RGB, and HSL values.",
    url: "https://aztools.in/tools/random-color-generator",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
