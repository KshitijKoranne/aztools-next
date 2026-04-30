import type { Metadata } from "next";
import JsonToTypescriptClient from "./client";
export const metadata: Metadata = {
  title: "JSON to TypeScript",
  description: "Free online JSON to TypeScript interface generator. Paste JSON and instantly get a typed TypeScript interface with optional/unknown property controls.",
  keywords: ["json to typescript","json typescript interface","generate typescript","json to type","typescript generator"],
  alternates: { canonical: "https://aztools.in/tools/json-to-typescript" },
  openGraph: { title: "JSON to TypeScript - AZ Tools", description: "Generate TypeScript interfaces from JSON instantly — with optional/unknown controls.", url: "https://aztools.in/tools/json-to-typescript", type: "website" },
};
export default function Page() { return <JsonToTypescriptClient />; }
