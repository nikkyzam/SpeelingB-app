#!/usr/bin/env node
/**
 * Grant or revoke the "admin" custom claim on a Firebase Auth user.
 *
 * Custom claims are the tamper-proof way to mark an admin: the flag rides
 * inside the user's ID token, so it can be checked in the app AND enforced in
 * Firestore security rules (request.auth.token.admin == true). Claims can only
 * be set from a trusted server environment with the Admin SDK — never the
 * browser — which is why this runs as a one-off script.
 *
 * Setup (once):
 *   1. Firebase Console -> Project settings -> Service accounts ->
 *      "Generate new private key". Save it as serviceAccountKey.json in the
 *      project root (it is gitignored — never commit it).
 *   2. The signed-in account for that key must be an Owner/Editor of the project.
 *
 * Usage:
 *   node scripts/set-admin.mjs someone@example.com          # grant admin
 *   node scripts/set-admin.mjs someone@example.com --revoke # remove admin
 *
 * After running, the user must sign out and back in (or wait up to ~1h for the
 * token to refresh) for the new claim to take effect.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  resolve(__dirname, '..', 'serviceAccountKey.json');

const [, , email, flag] = process.argv;
const revoke = flag === '--revoke';

if (!email) {
  console.error('Usage: node scripts/set-admin.mjs <email> [--revoke]');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(KEY_PATH, 'utf8'));
} catch {
  console.error(
    `\n✖ Could not read a service-account key at:\n  ${KEY_PATH}\n\n` +
      'Generate one in Firebase Console -> Project settings -> Service accounts ->\n' +
      '"Generate new private key", save it as serviceAccountKey.json in the project\n' +
      'root, or set GOOGLE_APPLICATION_CREDENTIALS to its path.\n'
  );
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });

try {
  const user = await getAuth().getUserByEmail(email);
  // setCustomUserClaims REPLACES all custom claims for the user; since "admin"
  // is the only claim we use, {admin:true} grants and {} revokes.
  await getAuth().setCustomUserClaims(user.uid, revoke ? {} : { admin: true });
  console.log(
    `\n✔ ${revoke ? 'Revoked admin from' : 'Granted admin to'} ${email} (uid: ${user.uid}).\n` +
      '  They must sign out and back in for the change to take effect.\n'
  );
  process.exit(0);
} catch (err) {
  if (err?.code === 'auth/user-not-found') {
    console.error(`\n✖ No user with email ${email}. They must sign up first.\n`);
  } else {
    console.error('\n✖ Failed to set claim:', err?.message || err, '\n');
  }
  process.exit(1);
}
