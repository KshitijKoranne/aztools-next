import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Image Flipper",
  description: "Flip images horizontally or vertically in your browser.",
  alternates: { canonical: "https://aztools.in/tools/image-flipper" },
};

export default function ImageFlipperPage() {
  return <Client />;
}
