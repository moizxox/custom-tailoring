import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.kostuemschneiderei.ch",
      },
    ],
  },
};

export default nextConfig;
