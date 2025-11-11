import type { NextConfig } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

type ManifestDefinition = {
  relativePath: string[];
  createContents: () => Record<string, unknown>;
};

const distDir = process.env.NEXT_DIST_DIR || '.next';
const manifestDefinitions: ManifestDefinition[] = [
  {
    relativePath: ['routes-manifest.json'],
    createContents: () => ({
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
    }),
  },
  {
    relativePath: ['prerender-manifest.json'],
    createContents: () => ({
      version: 4,
      routes: {},
      dynamicRoutes: {},
      preview: {
        previewModeId: crypto.randomBytes(16).toString('hex'),
        previewModeSigningKey: crypto.randomBytes(32).toString('base64'),
        previewModeEncryptionKey: crypto.randomBytes(32).toString('base64'),
      },
      notFoundRoutes: [],
    }),
  },
  {
    relativePath: ['server', 'middleware-manifest.json'],
    createContents: () => ({
      version: 3,
      middleware: {},
      functions: {},
      sortedMiddleware: [],
    }),
  },
];

function ensureDevManifestsSync() {
  for (const manifest of manifestDefinitions) {
    const manifestPath = path.join(process.cwd(), distDir, ...manifest.relativePath);

    if (fs.existsSync(manifestPath)) {
      continue;
    }

    try {
      fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
      fs.writeFileSync(
        manifestPath,
        `${JSON.stringify(manifest.createContents(), null, 2)}\n`,
        'utf8'
      );
      console.info(`[next.config] Created missing ${path.relative(process.cwd(), manifestPath)}`);
    } catch (error) {
      console.warn(
        `[next.config] Failed to ensure ${manifest.relativePath.join('/')}:`,
        error
      );
    }
  }
}

ensureDevManifestsSync();

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
