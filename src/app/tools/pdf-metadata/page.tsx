import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "PDF Metadata Editor",
  description: "View, edit, or clear PDF title, author, subject, keywords, creator, and producer metadata.",
  keywords: ["pdf metadata", "pdf metadata editor", "remove pdf metadata", "edit pdf properties"],
  alternates: { canonical: "https://aztools.in/tools/pdf-metadata" },
  openGraph: { title: "PDF Metadata Editor - AZ Tools", description: "View and edit PDF metadata locally in your browser.", url: "https://aztools.in/tools/pdf-metadata", type: "website" },
};

export default function Page() {
  return <Client />;
}
