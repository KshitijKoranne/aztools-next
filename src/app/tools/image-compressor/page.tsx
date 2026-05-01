import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Image Compressor",
  description: "Compress images by resizing and lowering JPEG/WebP quality in your browser.",
  alternates: { canonical: "https://aztools.in/tools/image-compressor" },
};

export default function ImageCompressorPage() {
  return <Client />;
}
