import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Aspect Ratio Calculator",
  description: "Calculate missing width or height from aspect ratios and simplify image, video, and layout ratios.",
  keywords: ["aspect ratio calculator", "image ratio calculator", "video ratio calculator", "resize calculator"],
  alternates: { canonical: "https://aztools.in/tools/aspect-ratio-calculator" },
  openGraph: { title: "Aspect Ratio Calculator - AZ Tools", description: "Calculate dimensions from aspect ratios.", url: "https://aztools.in/tools/aspect-ratio-calculator", type: "website" },
};

export default function Page() {
  return <Client />;
}
