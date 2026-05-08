import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "GitHub Repo Inspector",
  description: "Inspect public GitHub repository stars, forks, license, language, topics, and activity.",
  keywords: ["github repo inspector", "github repository stats", "github stars", "repo lookup"],
  alternates: { canonical: "https://aztools.in/tools/github-repo-inspector" },
  openGraph: { title: "GitHub Repo Inspector - AZ Tools", description: "Inspect public GitHub repository stats.", url: "https://aztools.in/tools/github-repo-inspector", type: "website" },
};

export default function Page() {
  return <Client />;
}
