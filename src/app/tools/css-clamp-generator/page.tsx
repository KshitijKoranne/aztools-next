import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "CSS Clamp Generator",
  description: "Generate responsive CSS clamp values from min and max sizes across viewport widths.",
  keywords: ["css clamp generator", "responsive font size", "fluid typography", "css tools"],
  alternates: { canonical: "https://aztools.in/tools/css-clamp-generator" },
  openGraph: { title: "CSS Clamp Generator - AZ Tools", description: "Generate responsive clamp() CSS values.", url: "https://aztools.in/tools/css-clamp-generator", type: "website" },
};

export default function Page() {
  return <Client />;
}
