import type { Metadata } from "next";
import SvgCodeGeneratorClient from "./client";
export const metadata: Metadata = {
  title: "SVG Code Generator",
  description: "Free online SVG code generator. Draw rectangles, circles, ellipses, lines, and text on a canvas and get the SVG code in real time.",
  keywords: ["svg generator","svg code","svg editor","draw svg","svg online"],
  alternates: { canonical: "https://aztools.in/tools/svg-code-generator" },
  openGraph: { title: "SVG Code Generator - AZ Tools", description: "Draw shapes on a canvas and get SVG code in real time — no login needed.", url: "https://aztools.in/tools/svg-code-generator", type: "website" },
};
export default function Page() { return <SvgCodeGeneratorClient />; }
