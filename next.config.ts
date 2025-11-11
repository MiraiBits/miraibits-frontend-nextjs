import type { NextConfig } from 'next';
import fs from 'node:fs';
import path from 'node:path';

function ensureRoutesManifestSync() {
  try {
    const distDir = process.env.NEXT_DIST_DIR || '.next';
    const manifestPath = path.join(process.cwd(), distDir, 'routes-manifest.json');

    if (fs.existsSync(manifestPath)) {
      return;
    }

    const defaultManifest = {
      version: 4,
      caseSensitive: false,
      basePath: '',
      headers: [],
      redirects: [],
      rewrites: {
        beforeFiles: [],
        afterFiles: [],
        fallback: [],
      },
    };

    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    fs.writeFileSync(manifestPath, `${JSON.stringify(defaultManifest, null, 2)}\n`, 'utf8');
    console.info('[next.config] Created missing .next/routes-manifest.json');
  } catch (error) {
    console.warn('[next.config] Failed to ensure .next/routes-manifest.json:', error);
  }
}

ensureRoutesManifestSync();

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

