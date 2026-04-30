import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/tools/", "/category/"],
        disallow: ["/search?*"],
      },
    ],
    sitemap: "https://aztools.in/sitemap.xml",
    host: "https://aztools.in",
  };
}
