import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Lorem Pixel Image Generator",
  description: "Generate placeholder PNG images with custom size, color, and text.",
  alternates: { canonical: "https://aztools.in/tools/lorem-pixel-generator" },
};

export default function LoremPixelGeneratorPage() {
  return <Client />;
}
