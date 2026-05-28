import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Dictionary Lookup",
  description: "Look up English word definitions, phonetics, examples, synonyms, and audio using a free dictionary API.",
  keywords: ["dictionary lookup", "word definition", "free dictionary api", "english definitions"],
  alternates: { canonical: "https://aztools.in/tools/dictionary-lookup" },
  openGraph: {
    title: "Dictionary Lookup - AZ Tools",
    description: "Look up English definitions, examples, synonyms, and audio.",
    url: "https://aztools.in/tools/dictionary-lookup",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
