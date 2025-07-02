/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@edulynx/ui-primitives'],
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  // Temporarily disable rewrites for stability
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
