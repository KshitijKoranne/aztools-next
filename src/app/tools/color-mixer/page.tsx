import type { Metadata } from "next";
import ColorMixerClient from "./client";
export const metadata: Metadata = {
  title: "Color Mixer",
  description: "Free online color mixer. Blend two colors with a custom ratio and see the mixed result as HEX and RGB values in real time.",
  keywords: ['color', 'mixer', 'blend', 'colors', 'mix', 'colors', 'color', 'blending', 'hex', 'rgb'],
  alternates: { canonical: "https://aztools.in/tools/color-mixer" },
  openGraph: { title: "Color Mixer - AZ Tools", description: "Free online color mixer. Blend two colors with a custom ratio and see the mixed result as HEX and RGB values in real time.", url: "https://aztools.in/tools/color-mixer", type: "website" },
};
export default function Page() { return <ColorMixerClient />; }
