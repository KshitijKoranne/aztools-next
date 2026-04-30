import type { Metadata } from "next";
import ColorPaletteGeneratorClient from "./client";
export const metadata: Metadata = {
  title: "Color Palette Generator",
  description: "Free online color palette generator. Generate monochromatic, analogous, complementary, triadic, and tetradic palettes from any base color.",
  keywords: ['color', 'palette', 'generator', 'color', 'scheme', 'complementary', 'analogous', 'triadic'],
  alternates: { canonical: "https://aztools.in/tools/color-palette-generator" },
  openGraph: { title: "Color Palette Generator - AZ Tools", description: "Free online color palette generator. Generate monochromatic, analogous, complementary, triadic, and tetradic palettes from any base color.", url: "https://aztools.in/tools/color-palette-generator", type: "website" },
};
export default function Page() { return <ColorPaletteGeneratorClient />; }
