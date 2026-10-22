/**
 * What there is to study outside spelling, and where its questions live.
 *
 * Banks are loaded with dynamic import() so the ~700 KB of questions is only
 * fetched for the subject a child opens.
 */
import type { QuestionBank, SubjectId } from './types'
import curriculum from '../../data/subjects/math/quest/curriculum.json'

export interface TestForm {
  id: string
  name: string
  desc: string
  recommended?: boolean
  /** Played on its own; never offered as an add-on. */
  standalone?: boolean
}

/** One topic of a test's study notes: what it is, how to do it, a worked example. */
export interface NoteSection {
  title: string
  icon: string
  /** May hold the same light markup as questions (see RichText). */
  intro: string
  steps?: string[]
  example?: { title: string; lines: string[] }
  /** A ladder-method diagram: each row is [divisor, ...numbers]; the last row has an empty divisor. */
  ladder?: { rows: string[][] }
  /** Side-by-side comparison, e.g. LCM vs GCF. */
  compare?: { head: string; points: string[]; example?: string }[]
  remember?: string
}

export interface SubjectTest {
  id: string
  subject: SubjectId
  /** 'k' or '1'…'8' */
  grade: string
  name: string
  desc: string
  /** Absent for a one-form test (its questions are under `main`). */
  forms?: TestForm[]
  /** A form whose questions can be added to the end of any non-standalone form. */
  addOn?: { form: string; text: string }
  load: () => Promise<QuestionBank>
  /** Study notes to read before the test. */
  notes?: () => Promise<NoteSection[]>
}

export interface Subject {
  id: SubjectId
  name: string
  icon: string
  blurb: string
  tone: 'primary' | 'secondary' | 'accent' | 'success'
}

export const SUBJECTS: Subject[] = [
  { id: 'math', name: 'Math', icon: '🔢', blurb: 'Numbers, shapes and puzzles from K to Grade 8', tone: 'primary' },
  { id: 'social-studies', name: 'Social Studies', icon: '🌍', blurb: 'Governments, economies and the world', tone: 'secondary' },
  { id: 'language-arts', name: 'Language Arts', icon: '✒️', blurb: 'Stories, poems and how writers work', tone: 'accent' },
]

export const subjectById = (id: string): Subject | undefined => SUBJECTS.find((s) => s.id === id)

const bank = (p: Promise<{ default: unknown }>) => p.then((m) => m.default as QuestionBank)

export const TESTS: SubjectTest[] = [
  {
    id: 'integer-operations',
    subject: 'math',
    grade: '6',
    name: 'Integer Operations',
    desc: 'Order of operations, absolute value, exponents and word problems.',
    forms: [
      { id: 'B', name: 'Fresh Test', desc: 'The study guide skills with all-new numbers.', recommended: true },
      { id: 'D', name: 'Another Fresh Test', desc: 'The same skills with different numbers again.' },
      { id: 'A', name: 'Study Guide', desc: 'The problems as they appear on the sheet.' },
      { id: 'K', name: 'Concept Check', desc: 'The rules behind the arithmetic — matching, ordering and true/false.', standalone: true },
      { id: 'C', name: 'Challenge Round', desc: '12 harder problems a step past the guide.', standalone: true },
    ],
    addOn: { form: 'C', text: 'Add the 12 challenge problems to the end' },
    load: () => bank(import('../../data/subjects/math/integer-operations.json')),
  },
  {
    id: 'decimal-operations',
    subject: 'math',
    grade: '6',
    name: 'Decimal Operations',
    desc: 'Add, subtract, multiply and divide decimals — including negatives and remainders.',
    forms: [
      { id: 'T', name: 'Decimal Test', desc: 'A mixed test of all four operations.', recommended: true },
      { id: 'S', name: 'Add & Subtract', desc: 'Decimal sums, differences and multi-step expressions.' },
      { id: 'M', name: 'Multiply & Divide', desc: 'Products and quotients with positive and negative decimals.' },
      { id: 'P', name: 'Mixed Practice', desc: 'Order of operations with decimals.' },
      { id: 'R', name: 'Interpreting Remainders', desc: 'Round up, ignore it, or split it?', standalone: true },
    ],
    load: () => bank(import('../../data/subjects/math/decimal-operations.json')),
  },
  {
    id: 'gcf-lcm-distributive',
    subject: 'math',
    grade: '6',
    name: 'GCF, LCM & the Distributive Property',
    desc: 'Factors and multiples, the ladder method, GCF-or-LCM word problems, and a(b + c) = ab + ac.',
    forms: [
      { id: 'F', name: 'Fresh Test', desc: 'Every skill from the notes, with all-new numbers.', recommended: true },
      { id: 'G', name: 'Greatest Common Factor', desc: 'The GCF notes and assignment, as on the sheets.' },
      { id: 'L', name: 'Least Common Multiple', desc: 'The LCM notes and assignment, as on the sheets.' },
      { id: 'W', name: 'Word Problems', desc: 'Is it GCF or LCM? Then solve it.' },
      { id: 'D', name: 'Distributive Property', desc: 'Expand a(b + c), and factor a sum using its GCF.' },
      { id: 'K', name: 'Concept Check', desc: 'True/false, matching and ordering about the big ideas.', standalone: true },
    ],
    load: () => bank(import('../../data/subjects/math/gcf-lcm-distributive.json')),
    notes: () => import('../../data/subjects/math/gcf-lcm-distributive.notes.json').then((m) => m.default as NoteSection[]),
  },
  {
    id: 'grade5-unit1',
    subject: 'math',
    grade: '5',
    name: 'Place Value & Powers of 10',
    desc: 'Unit 1 prep: exponents, place value, multiplying and dividing, multi-step problems.',
    load: () => bank(import('../../data/subjects/math/grade5-unit1.json')),
  },
  {
    id: 'government-systems',
    subject: 'social-studies',
    grade: '6',
    name: 'Government Systems',
    desc: 'Parliamentary vs. presidential democracy across the UK, Germany and Russia.',
    load: () => bank(import('../../data/subjects/social-studies/government-systems.json')),
  },
  {
    id: 'economic-systems',
    subject: 'social-studies',
    grade: '6',
    name: 'Economic Systems',
    desc: 'Vocabulary, the factors of production, trade barriers and GDP.',
    load: () => bank(import('../../data/subjects/social-studies/economic-systems.json')),
  },
  {
    id: 'european-union',
    subject: 'social-studies',
    grade: '6',
    name: 'European Union',
    desc: 'Why the EU formed, how it grew, its regions, and Brexit.',
    load: () => bank(import('../../data/subjects/social-studies/european-union.json')),
  },
  {
    id: 'narrative-poetic-techniques',
    subject: 'language-arts',
    grade: '6',
    name: 'Narrative & Poetic Techniques',
    desc: 'Point of view, figurative language, tone vs. mood, poetry and grammar.',
    load: () => bank(import('../../data/subjects/language-arts/narrative-poetic-techniques.json')),
  },
]

export const testsFor = (subject: SubjectId): SubjectTest[] => TESTS.filter((t) => t.subject === subject)
export const testById = (id: string): SubjectTest | undefined => TESTS.find((t) => t.id === id)

export const gradeLabel = (g: string): string => (g === 'k' ? 'Kindergarten' : `Grade ${g}`)

// ---------------- Math Quest ----------------

export interface QuestTopic {
  id: string
  name: string
}
export interface QuestUnit {
  name: string
  /** Enrichment beyond the standards. */
  advanced?: boolean
  topics: QuestTopic[]
}
export interface QuestGrade {
  grade: string
  label: string
  units: QuestUnit[]
}

export const QUEST_GRADES = curriculum as QuestGrade[]

export const QUEST_TIERS = [
  { level: 1, id: 'practice', name: 'Practice', icon: '🌱' },
  { level: 2, id: 'challenge', name: 'Challenge', icon: '⚡' },
  { level: 3, id: 'boss', name: 'Boss Round', icon: '👑' },
] as const

export type QuestTierId = (typeof QUEST_TIERS)[number]['id']

const questLoaders: Record<string, () => Promise<{ default: unknown }>> = {
  k: () => import('../../data/subjects/math/quest/grade-k.json'),
  '1': () => import('../../data/subjects/math/quest/grade-1.json'),
  '2': () => import('../../data/subjects/math/quest/grade-2.json'),
  '3': () => import('../../data/subjects/math/quest/grade-3.json'),
  '4': () => import('../../data/subjects/math/quest/grade-4.json'),
  '5': () => import('../../data/subjects/math/quest/grade-5.json'),
  '6': () => import('../../data/subjects/math/quest/grade-6.json'),
  '7': () => import('../../data/subjects/math/quest/grade-7.json'),
  '8': () => import('../../data/subjects/math/quest/grade-8.json'),
}

/** Topic ids start with their grade: "k-count", "g4-multcomp". */
export const gradeOfTopic = (topicId: string): string => {
  const head = topicId.split('-')[0]
  return head === 'k' ? 'k' : head.replace(/^g/, '')
}

export const findTopic = (topicId: string): { grade: QuestGrade; unit: QuestUnit; topic: QuestTopic } | undefined => {
  for (const grade of QUEST_GRADES)
    for (const unit of grade.units)
      for (const topic of unit.topics) if (topic.id === topicId) return { grade, unit, topic }
  return undefined
}

/** Every question for one topic, all tiers. */
export const loadQuestTopic = async (topicId: string) => {
  const load = questLoaders[gradeOfTopic(topicId)]
  if (!load) return []
  const banks = (await load()).default as QuestionBank
  return banks[topicId] ?? []
}
