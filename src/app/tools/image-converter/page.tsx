import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Image Converter",
  description: "Convert images between PNG, JPEG, and WebP in your browser.",
  alternates: { canonical: "https://aztools.in/tools/image-converter" },
};

export default function ImageConverterPage() {
  return <Client />;
}
