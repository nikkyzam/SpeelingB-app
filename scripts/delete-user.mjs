#!/usr/bin/env node
/**
 * Delete a user for good: their Firebase Auth login AND everything the app
 * stored about them.
 *
 * The admin console in the app removes a child's data and locks them out, but
 * it cannot take the login away — the browser SDK can only delete the account
 * it is signed in as. Deleting somebody else's login needs the Admin SDK, which
 * only runs in a trusted place, which is why this is a script.
 *
 * Setup (once):
 *   1. Firebase Console -> Project settings -> Service accounts ->
 *      "Generate new private key". Save it as serviceAccountKey.json in the
 *      project root (it is gitignored — never commit it).
 *   2. The signed-in account for that key must be an Owner/Editor of the project.
 *
 * Usage:
 *   node scripts/delete-user.mjs someone@example.com --dry-run  # show what would go
 *   node scripts/delete-user.mjs someone@example.com            # ask, then delete
 *   node scripts/delete-user.mjs someone@example.com --yes      # no questions
 *
 * A copy of their data is written to <email>-backup.json before anything is
 * removed, unless --no-backup is passed. This cannot be undone otherwise.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  resolve(__dirname, '..', 'serviceAccountKey.json');

const args = process.argv.slice(2);
const email = args.find((a) => !a.startsWith('--'));
const dryRun = args.includes('--dry-run');
const assumeYes = args.includes('--yes');
const noBackup = args.includes('--no-backup');

if (!email) {
  console.error(
    'Usage: node scripts/delete-user.mjs <email> [--dry-run] [--yes] [--no-backup]'
  );
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

const auth = getAuth();
const db = getFirestore();

let user;
try {
  user = await auth.getUserByEmail(email);
} catch (err) {
  if (err?.code === 'auth/user-not-found') {
    console.error(`\n✖ No user with email ${email}.\n`);
  } else {
    console.error('\n✖ Could not look that user up:', err?.message || err, '\n');
  }
  process.exit(1);
}

const ref = db.collection('users').doc(user.uid);
const snap = await ref.get();
const data = snap.exists ? snap.data() : null;

// Say plainly what is about to go.
const learned = data?.progress?.wordsLearnedTotal?.length ?? 0;
const stars = data?.points?.availablePoints ?? 0;
console.log(`\nAbout to delete:\n`);
console.log(`  name    ${data?.userData?.name || user.displayName || '(no name)'}`);
console.log(`  email   ${email}`);
console.log(`  uid     ${user.uid}`);
console.log(`  data    ${snap.exists ? `${learned} words learnt, ${stars} stars` : 'no saved data'}`);
console.log(`  login   will be removed — they can never sign in again\n`);

if (dryRun) {
  console.log('--dry-run: nothing was changed.\n');
  process.exit(0);
}

if (snap.exists && !noBackup) {
  const file = resolve(process.cwd(), `${email.replace(/[^a-z0-9]+/gi, '-')}-backup.json`);
  writeFileSync(file, JSON.stringify({ uid: user.uid, email, ...data }, null, 2));
  console.log(`  A copy was saved to ${file}\n`);
}

if (!assumeYes) {
  const rl = createInterface({ input: stdin, output: stdout });
  const answer = await rl.question(`Type the email again to confirm: `);
  rl.close();
  if (answer.trim() !== email) {
    console.log('\nThat did not match. Nothing was deleted.\n');
    process.exit(1);
  }
}

try {
  // Data first: if the login went first and this failed, an orphaned document
  // would be left with nobody able to sign in and clear it.
  if (snap.exists) await ref.delete();
  await auth.deleteUser(user.uid);
  console.log(`\n✔ Deleted ${email} (uid: ${user.uid}) and all their data.\n`);
  process.exit(0);
} catch (err) {
  console.error('\n✖ Failed part-way through:', err?.message || err);
  console.error('  Re-run to finish — deleting again is safe.\n');
  process.exit(1);
}
