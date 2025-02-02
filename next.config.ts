import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'novaeafit.blob.core.windows.net',
        port: '',
        pathname: '/vtg-2025-1/**', 
      }
    ]
  }
};

export default nextConfig;
