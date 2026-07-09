import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow remote avatar images (dicebear). Note: these are SVGs, which
    // next/image passes through rather than optimizing, so the teachers page
    // intentionally keeps a plain <img> to avoid enabling dangerouslyAllowSVG.
    // The pattern is registered here so raster remote images added later can
    // use next/image without a config change.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
};

export default nextConfig;
