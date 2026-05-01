import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "MIME Type Lookup",
  description: "Look up common MIME types by file extension or find extensions for a content type.",
  keywords: ["mime type lookup", "content type lookup", "file extension mime", "media type"],
  alternates: { canonical: "https://aztools.in/tools/mime-type-lookup" },
  openGraph: {
    title: "MIME Type Lookup - AZ Tools",
    description: "Find common MIME types and file extensions.",
    url: "https://aztools.in/tools/mime-type-lookup",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
