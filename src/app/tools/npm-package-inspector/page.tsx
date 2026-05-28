import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "NPM Package Inspector",
  description: "Look up live npm package metadata, latest version, maintainers, repository, and weekly downloads.",
  keywords: ["npm package inspector", "npm registry lookup", "npm package stats", "npm downloads"],
  alternates: { canonical: "https://aztools.in/tools/npm-package-inspector" },
  openGraph: {
    title: "NPM Package Inspector - AZ Tools",
    description: "Inspect live npm package metadata and weekly downloads.",
    url: "https://aztools.in/tools/npm-package-inspector",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
