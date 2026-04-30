import type { Metadata } from "next";
import CodeBeautifierClient from "./client";
export const metadata: Metadata = {
  title: "Code Beautifier",
  description: "Free online code beautifier. Format and prettify JSON, SQL, JavaScript, and HTML code with configurable indentation.",
  keywords: ["code beautifier","code formatter","format json","format sql","prettify code","online code formatter"],
  alternates: { canonical: "https://aztools.in/tools/code-beautifier" },
  openGraph: { title: "Code Beautifier - AZ Tools", description: "Format and prettify JSON, SQL, JavaScript, and HTML — in-browser.", url: "https://aztools.in/tools/code-beautifier", type: "website" },
};
export default function Page() { return <CodeBeautifierClient />; }
