import type { Metadata } from "next";
import CssFormatterClient from "./client";
export const metadata: Metadata = {
  title: "CSS Formatter & Minifier",
  description: "Free online CSS formatter and minifier. Beautify messy CSS with configurable indentation, or minify CSS to reduce file size.",
  keywords: ["css formatter","css beautifier","css minifier","format css online","prettify css"],
  alternates: { canonical: "https://aztools.in/tools/css-formatter" },
  openGraph: { title: "CSS Formatter & Minifier - AZ Tools", description: "Beautify or minify CSS with configurable indentation — in-browser.", url: "https://aztools.in/tools/css-formatter", type: "website" },
};
export default function Page() { return <CssFormatterClient />; }
