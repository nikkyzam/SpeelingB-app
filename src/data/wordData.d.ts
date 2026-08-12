export interface WordData {
  id: string;
  word: string;
  meaning: string;
  sentences?: string[];
  vocabulary_question?: string;
  difficulty: number;
  source: string;
  [key: string]: any;
}

export function getAllWords(): WordData[];
export function getWordsByDifficulty(difficulty: number): WordData[];
export function getRandomWords(count: number, difficulty?: number): WordData[];
export function getWordByText(wordText: string): WordData | undefined;
export function searchWords(query: string): WordData[];

export const ALL_WORDS: WordData[];
export const ONE_BEE_WORDS: WordData[];
export const TWO_BEE_WORDS: WordData[];
export const THREE_BEE_WORDS: WordData[];
