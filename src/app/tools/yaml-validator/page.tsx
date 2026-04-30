import type { Metadata } from "next";
import YamlValidatorClient from "./client";
export const metadata: Metadata = {
  title: "YAML Validator",
  description: "Free online YAML validator and formatter. Paste YAML to validate its syntax and get a clean, normalized output.",
  keywords: ["yaml validator","validate yaml","yaml formatter","yaml syntax check","yaml linter"],
  alternates: { canonical: "https://aztools.in/tools/yaml-validator" },
  openGraph: { title: "YAML Validator - AZ Tools", description: "Validate and format YAML syntax instantly in your browser.", url: "https://aztools.in/tools/yaml-validator", type: "website" },
};
export default function Page() { return <YamlValidatorClient />; }
