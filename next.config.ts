import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/tools/color-contrast",
        destination: "/tools/color-contrast-checker",
        permanent: true,
      },
      {
        source: "/tools/color-palette",
        destination: "/tools/color-palette-generator",
        permanent: true,
      },
      {
        source: "/tools/compound-interest",
        destination: "/tools/compound-interest-calculator",
        permanent: true,
      },
      {
        source: "/favorites",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
