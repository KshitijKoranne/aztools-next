import type { Metadata } from "next";
import UrlParserClient from "./client";

export const metadata: Metadata = {
  title: "URL Parser",
  description: "Parse URLs into protocol, host, path, query parameters, and hash.",
  alternates: { canonical: "https://aztools.in/tools/url-parser" },
};

export default function UrlParserPage() {
  return <UrlParserClient />;
}
