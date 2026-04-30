import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "CRON Expression Generator",
  description: "Free CRON expression generator with presets, field builder, and quick syntax reference.",
  alternates: { canonical: "https://aztools.in/tools/cron-generator" },
  openGraph: {
    title: "CRON Expression Generator - AZ Tools",
    description: "Create and understand CRON expressions for scheduled jobs.",
    url: "https://aztools.in/tools/cron-generator",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
