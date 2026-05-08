import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Country Info Lookup",
  description: "Look up country capitals, population, currencies, languages, maps, borders, and timezones.",
  keywords: ["country info", "country lookup", "rest countries", "capital lookup", "country data"],
  alternates: { canonical: "https://aztools.in/tools/country-info-lookup" },
  openGraph: { title: "Country Info Lookup - AZ Tools", description: "Search live country facts and map links.", url: "https://aztools.in/tools/country-info-lookup", type: "website" },
};

export default function Page() {
  return <Client />;
}
