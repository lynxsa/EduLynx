/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@edulynx/ui-primitives'],
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'picsum.photos', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Temporarily disable rewrites for stability
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
