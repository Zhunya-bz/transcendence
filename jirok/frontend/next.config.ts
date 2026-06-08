import type { NextConfig } from "next";
import { devIndicatorServerState } from "next/dist/server/dev/dev-indicator-server-state";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
};

export default nextConfig;


