import type { Metadata } from "next";
import JsonSchemaGeneratorClient from "./client";

export const metadata: Metadata = {
  title: "JSON Schema Generator",
  description: "Generate clean JSON Schema from JSON samples instantly in your browser with required fields, examples, and format detection.",
  keywords: ["json schema generator", "json to schema", "generate json schema", "json validator schema", "developer tools"],
  alternates: { canonical: "https://aztools.in/tools/json-schema-generator" },
  openGraph: {
    title: "JSON Schema Generator - AZ Tools",
    description: "Turn JSON examples into clean, usable JSON Schema locally in your browser.",
    url: "https://aztools.in/tools/json-schema-generator",
    type: "website",
  },
};

export default function Page() {
  return <JsonSchemaGeneratorClient />;
}
