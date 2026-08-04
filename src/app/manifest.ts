import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AZ Tools",
    short_name: "AZ Tools",
    description: "A small collection of useful apps by KJR Labs.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2efe8",
    theme_color: "#f2efe8",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
