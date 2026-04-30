import type { Metadata } from "next";
import ColorContrastCheckerClient from "./client";
export const metadata: Metadata = {
  title: "Color Contrast Checker",
  description: "Free online WCAG color contrast checker. Test foreground and background color pairs against AA and AAA accessibility standards.",
  keywords: ['color', 'contrast', 'checker', 'WCAG', 'accessibility', 'AA', 'AAA', 'contrast', 'ratio'],
  alternates: { canonical: "https://aztools.in/tools/color-contrast-checker" },
  openGraph: { title: "Color Contrast Checker - AZ Tools", description: "Free online WCAG color contrast checker. Test foreground and background color pairs against AA and AAA accessibility standards.", url: "https://aztools.in/tools/color-contrast-checker", type: "website" },
};
export default function Page() { return <ColorContrastCheckerClient />; }
