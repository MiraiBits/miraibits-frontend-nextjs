import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
};

// Static export config - currently disabled due to dynamic API routes
// To enable static export, remove API routes that use dynamic = 'force-dynamic'
const exportConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  output: 'standalone'  // Commented out due to incompatible dynamic API routes
};

export default nextConfig; // Use regular config instead of exportConfig


