#!/usr/bin/env node
/**
 * Refuse to deploy a build that has no Firebase config in it.
 *
 * The config is read from `import.meta.env.VITE_FIREBASE_*` and baked into the
 * bundle at BUILD time (src/config/firebase.ts). Build with a missing or
 * placeholder .env and nothing fails: the build succeeds, the deploy succeeds,
 * hosting serves the new bundle, and then every visitor gets a blank white page
 * because `getAuth()` throws `auth/invalid-api-key` before React mounts. There
 * is no error on screen and nothing in the deploy output to hint at it.
 *
 * This runs as a `predeploy` hook, so a config-less deploy stops here instead.
 * Run it by hand any time with:  node scripts/verify-build.mjs
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(root, 'dist', 'assets');

const die = (headline, detail) => {
  console.error(`\n✖ ${headline}\n`);
  console.error(detail.trimEnd() + '\n');
  process.exit(1);
};

/** The build reads these from the environment, or from .env via Vite. */
const readEnv = (key) => {
  if (process.env[key]) return process.env[key];
  const file = join(root, '.env');
  if (!existsSync(file)) return undefined;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const at = line.indexOf('=');
    if (at === -1 || line.trimStart().startsWith('#')) continue;
    if (line.slice(0, at).trim() !== key) continue;
    // Vite strips surrounding quotes, so match its behaviour.
    return line.slice(at + 1).trim().replace(/^['"]|['"]$/g, '');
  }
  return undefined;
};

if (!existsSync(ASSETS)) {
  die(
    'No build to check.',
    `Expected bundled JavaScript in ${ASSETS}.\n` +
      'Run `npm run build` before deploying.'
  );
}

const apiKey = readEnv('VITE_FIREBASE_API_KEY');
const projectId = readEnv('VITE_FIREBASE_PROJECT_ID');

if (!apiKey || !projectId) {
  die(
    'No Firebase config to build with.',
    'VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID are not set, in the\n' +
      'environment or in .env. Copy .env.example to .env and fill it in from\n' +
      'Firebase Console -> Project settings -> Your apps -> SDK setup, then\n' +
      'run `npm run build` again.\n\n' +
      'Deploying now would put a blank white page in front of every child.'
  );
}

const bundles = readdirSync(ASSETS).filter((f) => f.endsWith('.js'));
const source = bundles.map((f) => readFileSync(join(ASSETS, f), 'utf8')).join('\n');

const missing = [
  ['API key', apiKey],
  ['project id', projectId],
].filter(([, value]) => !source.includes(value));

if (missing.length > 0) {
  die(
    'The build does not contain your Firebase config.',
    `Checked ${bundles.length} bundle(s) in dist/assets and could not find the ` +
      `${missing.map(([label]) => label).join(' or ')}.\n\n` +
      'That means .env was not present (or held different values) when this\n' +
      'build ran. Vite inlines these at build time, so rebuilding is the fix:\n\n' +
      '  npm run build\n\n' +
      'Deploying this bundle would serve a blank white page to everyone —\n' +
      'getAuth() throws auth/invalid-api-key before React mounts.'
  );
}

console.log(`✔ Firebase config is in the bundle (project ${projectId}). Safe to deploy.`);
