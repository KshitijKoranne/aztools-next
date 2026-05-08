import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Public Holiday Finder",
  description: "Find public holidays by country and year using free Nager.Date data.",
  keywords: ["public holidays", "holiday finder", "country holidays", "bank holidays"],
  alternates: { canonical: "https://aztools.in/tools/public-holiday-finder" },
  openGraph: { title: "Public Holiday Finder - AZ Tools", description: "Find public holidays by country and year.", url: "https://aztools.in/tools/public-holiday-finder", type: "website" },
};

export default function Page() {
  return <Client />;
}
