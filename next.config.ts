import type { NextConfig } from 'next';
import fs from 'fs';
import path from 'path';

const ROUTES_MANIFEST_PLACEHOLDER = {
  version: 5,
  pages404: true,
  basePath: '',
  redirects: [],
  rewrites: {
    beforeFiles: [],
    afterFiles: [],
    fallback: [],
  },
  headers: [],
  dynamicRoutes: [],
  dataRoutes: [],
  staticRoutes: [],
  sortedDynamicRoutes: [],
  i18n: null,
} as const;

function ensureDevRoutesManifest() {
  const phase = process.env.NEXT_PHASE;
  const isDevelopmentPhase =
    process.env.NODE_ENV !== 'production' ||
    phase === 'phase-development-server';
  if (!isDevelopmentPhase) {
    return;
  }

  const manifestPath = path.join(process.cwd(), '.next/routes-manifest.json');
  try {
    if (fs.existsSync(manifestPath)) {
      return;
    }
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    fs.writeFileSync(
      manifestPath,
      JSON.stringify(ROUTES_MANIFEST_PLACEHOLDER, null, 2),
      'utf8'
    );
    console.info(
      `[next-config] Created placeholder routes-manifest at ${manifestPath} for development`
    );
  } catch (error) {
    console.warn(
      '[next-config] Unable to create placeholder routes-manifest.json. Dev server may fail until the file exists.',
      error
    );
  }
}

ensureDevRoutesManifest();

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
  output: 'standalone'  // Commented out due to incompatible dynamic API routes
};

export default nextConfig; // Use regular config instead of exportConfig
