import type { Metadata } from "next";
import ColorBlindnessSimulatorClient from "./client";
export const metadata: Metadata = {
  title: "Color Blindness Simulator",
  description: "Free online color blindness simulator. Upload an image to see how it appears to people with protanopia, deuteranopia, tritanopia, or achromatopsia.",
  keywords: ['color', 'blindness', 'simulator', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'],
  alternates: { canonical: "https://aztools.in/tools/color-blindness-simulator" },
  openGraph: { title: "Color Blindness Simulator - AZ Tools", description: "Free online color blindness simulator. Upload an image to see how it appears to people with protanopia, deuteranopia, tritanopia, or achromatopsia.", url: "https://aztools.in/tools/color-blindness-simulator", type: "website" },
};
export default function Page() { return <ColorBlindnessSimulatorClient />; }
