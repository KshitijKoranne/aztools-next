import type { Metadata } from "next";
import YamlToJsonClient from "./client";

export const metadata: Metadata = {
  title: "YAML to JSON Converter",
  description: "Convert YAML documents to formatted or compact JSON in your browser.",
  alternates: { canonical: "https://aztools.in/tools/yaml-to-json" },
};

export default function YamlToJsonPage() {
  return <YamlToJsonClient />;
}
