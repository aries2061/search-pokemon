import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.pokemondb.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'corsproxy.io',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  outputFileTracingRoot: path.join(__dirname),
  // Fix RSC navigation errors by disabling strict mode
  reactStrictMode: false,
};

export default nextConfig;
