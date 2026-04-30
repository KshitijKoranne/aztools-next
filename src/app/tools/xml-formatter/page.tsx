import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "XML Formatter",
  description: "Format, validate, and minify XML content in your browser.",
  alternates: { canonical: "https://aztools.in/tools/xml-formatter" },
};

export default function XmlFormatterPage() {
  return <Client />;
}
