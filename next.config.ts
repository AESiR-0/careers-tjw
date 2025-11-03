import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://talaash.thejaayveeworld.com/*")],
  },
};

export default nextConfig;
