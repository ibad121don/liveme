// next.config.ts (or .js if you prefer)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
    eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
