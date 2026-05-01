import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "CHMOD Calculator",
  description: "Convert Unix file permissions between owner, group, other checkboxes, octal notation, and symbolic chmod strings.",
  keywords: ["chmod calculator", "unix permissions", "linux permissions", "octal permissions"],
  alternates: { canonical: "https://aztools.in/tools/chmod-calculator" },
  openGraph: {
    title: "CHMOD Calculator - AZ Tools",
    description: "Convert Unix permissions between octal and symbolic formats.",
    url: "https://aztools.in/tools/chmod-calculator",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
