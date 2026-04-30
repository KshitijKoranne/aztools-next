import type { Metadata } from "next";
import ColorExtractorClient from "./client";
export const metadata: Metadata = {
  title: "Image Color Extractor",
  description: "Free online image color extractor. Upload an image and extract its dominant colors as HEX codes. Download the palette as PNG.",
  keywords: ['color', 'extractor', 'image', 'colors', 'dominant', 'colors', 'palette', 'from', 'image'],
  alternates: { canonical: "https://aztools.in/tools/color-extractor" },
  openGraph: { title: "Image Color Extractor - AZ Tools", description: "Free online image color extractor. Upload an image and extract its dominant colors as HEX codes. Download the palette as PNG.", url: "https://aztools.in/tools/color-extractor", type: "website" },
};
export default function Page() { return <ColorExtractorClient />; }
