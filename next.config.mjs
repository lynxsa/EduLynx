/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [{hostname:"images.pexels.com"}],
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
