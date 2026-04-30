import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Unit Converter",
  description:
    "Free unit converter for length, weight, volume, temperature, area, time, speed, and digital storage units.",
  keywords: [
    "unit converter",
    "measurement converter",
    "length converter",
    "weight converter",
    "temperature converter",
  ],
  alternates: { canonical: "https://aztools.in/tools/unit-converter" },
  openGraph: {
    title: "Unit Converter - AZ Tools",
    description:
      "Convert length, weight, volume, temperature, area, time, speed, and digital storage units instantly.",
    url: "https://aztools.in/tools/unit-converter",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
