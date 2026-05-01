import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Image Resizer",
  description: "Resize images in your browser and download the result.",
  alternates: { canonical: "https://aztools.in/tools/image-resizer" },
};

export default function ImageResizerPage() {
  return <Client />;
}
