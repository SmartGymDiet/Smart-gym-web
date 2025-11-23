import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['github.com', 'randomuser.me'],
  },
  devIndicators: false,

  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  trailingSlash: false,
  compress: true,
};

export default nextConfig;
