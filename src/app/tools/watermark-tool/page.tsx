import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Watermark Tool",
  description: "Add text watermarks to images in your browser.",
  alternates: { canonical: "https://aztools.in/tools/watermark-tool" },
};

export default function WatermarkToolPage() {
  return <Client />;
}
