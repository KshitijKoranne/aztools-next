import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Time Zone Converter",
  description: "Free time zone converter for converting date and time between global time zones.",
  alternates: { canonical: "https://aztools.in/tools/time-zone-converter" },
  openGraph: {
    title: "Time Zone Converter - AZ Tools",
    description: "Convert date and time between global time zones.",
    url: "https://aztools.in/tools/time-zone-converter",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
