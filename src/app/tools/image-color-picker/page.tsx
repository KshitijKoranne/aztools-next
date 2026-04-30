import type { Metadata } from "next";
import ImageColorPickerClient from "./client";
export const metadata: Metadata = {
  title: "Image Color Picker",
  description: "Free online image color picker. Upload an image and click anywhere to pick exact HEX color values from it.",
  keywords: ['image', 'color', 'picker', 'pick', 'color', 'from', 'image', 'eyedropper', 'hex', 'color'],
  alternates: { canonical: "https://aztools.in/tools/image-color-picker" },
  openGraph: { title: "Image Color Picker - AZ Tools", description: "Free online image color picker. Upload an image and click anywhere to pick exact HEX color values from it.", url: "https://aztools.in/tools/image-color-picker", type: "website" },
};
export default function Page() { return <ImageColorPickerClient />; }
