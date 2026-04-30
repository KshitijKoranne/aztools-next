import type { Metadata } from "next";
import CodeMinifierClient from "./client";
export const metadata: Metadata = {
  title: "Code Minifier",
  description: "Free online code minifier. Minify JavaScript, CSS, and HTML to reduce file size. See the percentage reduction instantly.",
  keywords: ["code minifier","javascript minifier","css minifier","html minifier","compress code","minify js"],
  alternates: { canonical: "https://aztools.in/tools/code-minifier" },
  openGraph: { title: "Code Minifier - AZ Tools", description: "Minify JS, CSS, and HTML code to reduce file size — instant, in-browser.", url: "https://aztools.in/tools/code-minifier", type: "website" },
};
export default function Page() { return <CodeMinifierClient />; }
