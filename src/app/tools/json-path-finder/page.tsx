import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "JSON Path Finder",
  description: "Inspect JSON and find dot/bracket paths for matching keys and values.",
  keywords: ["json path finder", "json search", "json inspector", "json paths"],
  alternates: { canonical: "https://aztools.in/tools/json-path-finder" },
  openGraph: { title: "JSON Path Finder - AZ Tools", description: "Search JSON and copy exact object paths.", url: "https://aztools.in/tools/json-path-finder", type: "website" },
};

export default function Page() {
  return <Client />;
}
