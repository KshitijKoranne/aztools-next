import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Username Generator",
  description: "Free username generator for unique social media, gaming, and account name ideas.",
  alternates: { canonical: "https://aztools.in/tools/username-generator" },
  openGraph: {
    title: "Username Generator - AZ Tools",
    description: "Generate unique username ideas with styles, numbers, and separators.",
    url: "https://aztools.in/tools/username-generator",
    type: "website",
  },
};

export default function Page() {
  return <Client />;
}
