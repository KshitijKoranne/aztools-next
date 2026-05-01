import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "UUID Generator and Validator",
  description: "Free UUID generator and validator. Create UUID v4 values in bulk, format them, and validate existing UUIDs.",
  keywords: ["uuid generator", "guid generator", "uuid validator", "random uuid"],
  alternates: { canonical: "https://aztools.in/tools/uuid-generator" },
  openGraph: {
    title: "UUID Generator and Validator - AZ Tools",
    description: "Generate and validate UUID v4 identifiers in your browser.",
    url: "https://aztools.in/tools/uuid-generator",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
