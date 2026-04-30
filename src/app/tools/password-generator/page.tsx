import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Password Generator",
  description: "Free secure password generator with length, character set, and strength options.",
  alternates: { canonical: "https://aztools.in/tools/password-generator" },
  openGraph: {
    title: "Password Generator - AZ Tools",
    description: "Generate strong random passwords in your browser.",
    url: "https://aztools.in/tools/password-generator",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
