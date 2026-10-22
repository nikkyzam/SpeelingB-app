#!/usr/bin/env node
/**
 * Upload a private word list to Firestore (wordLists/{id}).
 *
 * Some lists may be used with our own children but not posted publicly —
 * the Scripps 2026–27 School Spelling Bee Study List says "This is
 * copyrighted material. Do not post to Web." This repo and the hosted site
 * are public, so such a list lives only in the gitignored private/ folder
 * and in Firestore, where firestore.rules lets signed-in users read it.
 *
 * The meanings, sentences and vocabulary questions are written fresh for
 * this app; only the words come from the official list.
 *
 * Input: private/word-lists/parts/<id>-*.json, each an array of
 *   { n, word, meaning, sentence, vocabulary_question }
 * merged in n order. Level comes from n: 1–150 One Bee, 151–300 Two Bee,
 * 301–450 Three Bee (the School Spelling Bee Study List's three sections).
 *
 * Usage (needs the gitignored serviceAccountKey.json, see set-admin.mjs):
 *   node scripts/upload-word-list.mjs school-2026 "2026 School Bee" --dry-run
 *   node scripts/upload-word-list.mjs school-2026 "2026 School Bee"
 *
 * Every upload bumps `version`, so devices that cached the old copy reload it.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const [, , id, title, flag] = process.argv
const dryRun = flag === '--dry-run'

if (!id || !title) {
  console.error('Usage: node scripts/upload-word-list.mjs <id> "<title>" [--dry-run]')
  process.exit(1)
}

const partsDir = join(ROOT, 'private', 'word-lists', 'parts')
const files = existsSync(partsDir) ? readdirSync(partsDir).filter((f) => f.startsWith(`${id}-`) && f.endsWith('.json')) : []
if (files.length === 0) {
  console.error(`No files named ${id}-*.json in ${partsDir}`)
  process.exit(1)
}

const levelOf = (n) => (n <= 150 ? 1 : n <= 300 ? 2 : 3)
const words = files
  .flatMap((f) => JSON.parse(readFileSync(join(partsDir, f), 'utf8')))
  .map(({ n, word, meaning, sentence, vocabulary_question }) => ({ n, word, meaning, sentence, vocabulary_question, level: levelOf(n) }))
  .sort((a, b) => a.n - b.n)

// The same checks the app relies on: blanking needs the word in its sentence,
// the vocab question needs one run of █ per letter, and a meaning that names
// the word gives the answer away.
const problems = []
const seen = new Set()
for (const w of words) {
  const where = `#${w.n} ${w.word}`
  if (seen.has(w.n)) problems.push(`${where}: duplicate number`)
  seen.add(w.n)
  for (const f of ['word', 'meaning', 'sentence', 'vocabulary_question']) if (!w[f]?.trim()) problems.push(`${where}: missing ${f}`)
  if (!w.sentence.includes(w.word)) problems.push(`${where}: sentence lacks the word`)
  if (new RegExp(`\\b${w.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(w.meaning)) problems.push(`${where}: meaning names the word`)
  const runs = w.vocabulary_question.match(/█+/g) ?? []
  if (runs.length !== 1 || runs[0].length !== w.word.length) problems.push(`${where}: vocab question needs one █ run of ${w.word.length}`)
}
if (problems.length) {
  console.error(`${problems.length} problem(s):\n` + problems.slice(0, 40).join('\n'))
  process.exit(1)
}
console.log(`${words.length} words from ${files.join(', ')} — levels:`, [1, 2, 3].map((l) => words.filter((w) => w.level === l).length).join(' / '))

if (dryRun) {
  console.log('Dry run: nothing uploaded.')
  process.exit(0)
}

const { initializeApp, cert } = await import('firebase-admin/app')
const { getFirestore, FieldValue } = await import('firebase-admin/firestore')
const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || join(ROOT, 'serviceAccountKey.json')
initializeApp({ credential: cert(JSON.parse(readFileSync(keyPath, 'utf8'))) })
const ref = getFirestore().collection('wordLists').doc(id)
const prev = await ref.get()
const version = (prev.exists ? prev.data().version ?? 0 : 0) + 1
await ref.set({ id, title, version, words, updatedAt: FieldValue.serverTimestamp() })
console.log(`Uploaded wordLists/${id} (${title}), version ${version}.`)
