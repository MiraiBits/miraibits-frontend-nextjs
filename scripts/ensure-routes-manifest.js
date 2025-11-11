#!/usr/bin/env node

/**
 * Ensures that `.next/routes-manifest.json` exists before the Next.js server
 * starts. Turbopack currently does not emit this manifest, but the Node.js
 * runtime still expects to read it for rewrites/redirects even when there are
 * none configured. Creating an empty manifest keeps the dev server happy.
 */

const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const logTag = '[ensure-dev-manifests]';
const projectDir = process.cwd();
const distDir = process.env.NEXT_DIST_DIR || '.next';

const manifestDefinitions = [
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

async function ensureManifest({ relativePath, createContents }) {
  const manifestPath = path.join(projectDir, distDir, ...relativePath);

  try {
    await fs.access(manifestPath);
    return;
  } catch (error) {
    if (!error || error.code !== 'ENOENT') {
      throw error;
    }
  }

  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(
    manifestPath,
    `${JSON.stringify(createContents(), null, 2)}\n`,
    'utf8'
  );
  const relativeLogPath = path.relative(projectDir, manifestPath) || manifestPath;
  console.info(`${logTag} created ${relativeLogPath}`);
}

async function ensureManifests() {
  for (const manifest of manifestDefinitions) {
    await ensureManifest(manifest);
  }
}

ensureManifests().catch(error => {
  console.error(`${logTag} failed:`, error);
  process.exitCode = 1;
});
