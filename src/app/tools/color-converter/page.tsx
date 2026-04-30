import type { Metadata } from "next";
import ColorConverterClient from "./client";
export const metadata: Metadata = {
  title: "Color Converter",
  description: "Free online color converter. Convert HEX to RGB, RGB to HEX, and HSL to HEX/RGB instantly in your browser.",
  keywords: ['color', 'converter', 'hex', 'rgb', 'hsl', 'convert', 'colors', 'online'],
  alternates: { canonical: "https://aztools.in/tools/color-converter" },
  openGraph: { title: "Color Converter - AZ Tools", description: "Free online color converter. Convert HEX to RGB, RGB to HEX, and HSL to HEX/RGB instantly in your browser.", url: "https://aztools.in/tools/color-converter", type: "website" },
};
export default function Page() { return <ColorConverterClient />; }
