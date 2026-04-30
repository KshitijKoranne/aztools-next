import type { Metadata } from "next";
import GradientGeneratorClient from "./client";
export const metadata: Metadata = {
  title: "CSS Gradient Generator",
  description: "Free online CSS gradient generator. Create linear and radial gradients with custom colors, direction, and angle. Copy CSS instantly.",
  keywords: ['css', 'gradient', 'generator', 'linear', 'gradient', 'radial', 'gradient', 'background', 'gradient'],
  alternates: { canonical: "https://aztools.in/tools/gradient-generator" },
  openGraph: { title: "CSS Gradient Generator - AZ Tools", description: "Free online CSS gradient generator. Create linear and radial gradients with custom colors, direction, and angle. Copy CSS instantly.", url: "https://aztools.in/tools/gradient-generator", type: "website" },
};
export default function Page() { return <GradientGeneratorClient />; }
