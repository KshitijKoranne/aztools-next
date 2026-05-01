import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "UTM Builder",
  description: "Build campaign URLs with UTM parameters, preview the final link, and parse existing tagged URLs.",
  keywords: ["utm builder", "campaign url builder", "utm generator", "marketing url"],
  alternates: { canonical: "https://aztools.in/tools/utm-builder" },
  openGraph: {
    title: "UTM Builder - AZ Tools",
    description: "Create clean UTM campaign URLs for analytics tracking.",
    url: "https://aztools.in/tools/utm-builder",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
