import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Image Crop Tool",
  description: "Crop images by pixel position and size in your browser.",
  alternates: { canonical: "https://aztools.in/tools/image-crop" },
};

export default function ImageCropPage() {
  return <Client />;
}
