import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Heading Structure Analyzer",
  description: "Analyze HTML heading hierarchy and find SEO structure issues.",
  alternates: { canonical: "https://aztools.in/tools/heading-structure" },
};

export default function HeadingStructurePage() {
  return <Client />;
}
