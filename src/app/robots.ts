import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/privacy-policy"],
        disallow: ["/tools/", "/category/", "/search", "/api/"],
      },
    ],
    sitemap: "https://aztools.in/sitemap.xml",
    host: "https://aztools.in",
  };
}
