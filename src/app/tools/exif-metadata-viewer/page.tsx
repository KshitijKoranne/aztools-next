import type { Metadata } from "next";
import ExifMetadataViewerClient from "./client";

export const metadata: Metadata = {
  title: "EXIF Metadata Viewer",
  description: "View image EXIF, GPS, camera, lens, and file metadata locally in your browser without uploading your photos.",
  keywords: ["exif viewer", "metadata viewer", "photo metadata", "gps metadata", "image exif", "camera metadata"],
  alternates: { canonical: "https://aztools.in/tools/exif-metadata-viewer" },
  openGraph: {
    title: "EXIF Metadata Viewer - AZ Tools",
    description: "Inspect photo EXIF, GPS, camera, lens, and file metadata privately in your browser.",
    url: "https://aztools.in/tools/exif-metadata-viewer",
    type: "website",
  },
};

export default function Page() {
  return <ExifMetadataViewerClient />;
}
