import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "HTTP Status Code Lookup",
  description: "Search HTTP status codes by number, name, category, and meaning with concise developer-friendly explanations.",
  keywords: ["http status codes", "status code lookup", "http response codes", "developer tools"],
  alternates: { canonical: "https://aztools.in/tools/http-status-lookup" },
  openGraph: {
    title: "HTTP Status Code Lookup - AZ Tools",
    description: "Search and understand HTTP response status codes.",
    url: "https://aztools.in/tools/http-status-lookup",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
