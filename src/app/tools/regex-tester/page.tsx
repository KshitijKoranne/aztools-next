import type { Metadata } from "next";
import RegexTesterClient from "./client";
export const metadata: Metadata = {
  title: "Regex Tester",
  description: "Free online regular expression tester. Test regex patterns against text with global, case-insensitive, multiline, and other flags.",
  keywords: ["regex tester","regular expression","regex matcher","test regex online","regexp"],
  alternates: { canonical: "https://aztools.in/tools/regex-tester" },
  openGraph: { title: "Regex Tester - AZ Tools", description: "Test regular expressions with live match highlighting and flag controls.", url: "https://aztools.in/tools/regex-tester", type: "website" },
};
export default function Page() { return <RegexTesterClient />; }
