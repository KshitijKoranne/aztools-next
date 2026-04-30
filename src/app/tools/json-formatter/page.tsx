import type { Metadata } from "next";
import JsonFormatterClient from "./client";
export const metadata: Metadata = {
  title: "JSON Formatter",
  description: "Free online JSON formatter, beautifier, minifier and validator. Instantly format, compress, or validate JSON in your browser.",
  keywords: ["json formatter","json beautifier","json minifier","json validator","format json online"],
  alternates: { canonical: "https://aztools.in/tools/json-formatter" },
  openGraph: { title: "JSON Formatter - AZ Tools", description: "Format, minify, and validate JSON instantly in your browser.", url: "https://aztools.in/tools/json-formatter", type: "website" },
};
export default function Page() { return <JsonFormatterClient />; }
