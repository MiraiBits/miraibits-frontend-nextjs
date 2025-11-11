#!/usr/bin/env node

/**
 * Ensures that `.next/routes-manifest.json` exists before the Next.js server
 * starts. Turbopack currently does not emit this manifest, but the Node.js
 * runtime still expects to read it for rewrites/redirects even when there are
 * none configured. Creating an empty manifest keeps the dev server happy.
 */

const fs = require('node:fs/promises');
const path = require('node:path');

async function ensureManifest() {
  const projectDir = process.cwd();
  const distDir = process.env.NEXT_DIST_DIR || '.next';
  const manifestPath = path.join(projectDir, distDir, 'routes-manifest.json');

  try {
    await fs.access(manifestPath);
    return;
  } catch (error) {
    if (error && error.code !== 'ENOENT') {
      throw error;
    }
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

  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(
    manifestPath,
    `${JSON.stringify(defaultManifest, null, 2)}\n`,
    'utf8'
  );
  const relativePath = path.relative(projectDir, manifestPath) || manifestPath;
  console.info(`[ensure-routes-manifest] created ${relativePath}`);
}

ensureManifest().catch(error => {
  console.error('[ensure-routes-manifest] failed:', error);
  process.exitCode = 1;
});
