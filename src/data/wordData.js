import CONCISE_ALL_BEE from './word-concise-all-bee.js';
import ONE_BEE_WORDS_DATA from './word-one-bee-data.js';
import TWO_BEE_WORDS_DATA from './word-two-bee-data.js';
import THREE_BEE_WORDS_DATA from './word-three-bee-data.js';

// Helper to assign difficulty and source
const processWords = (words, difficulty, source) => {
  return words.map((word, index) => ({
    ...word,
    id: `${source}-${index}`,
    difficulty,
    source
  }));
};

const processedConcise = processWords(CONCISE_ALL_BEE, 1, 'concise-all-bee');
const processedOneBee = processWords(ONE_BEE_WORDS_DATA, 1, 'one-bee');
const processedTwoBee = processWords(TWO_BEE_WORDS_DATA, 2, 'two-bee');
const processedThreeBee = processWords(THREE_BEE_WORDS_DATA, 3, 'three-bee');

// Merge all words, avoiding duplicates by word text
const allWordsMap = new Map();

[...processedConcise, ...processedOneBee, ...processedTwoBee, ...processedThreeBee].forEach(word => {
  const key = word.word.toLowerCase().trim();
  if (!allWordsMap.has(key)) {
    allWordsMap.set(key, word);
  }
});

const allWords = Array.from(allWordsMap.values());


export function getWordsByDifficulty(difficulty) {
  return allWords.filter(word => word.difficulty === difficulty);
}

export function getAllWords() {
  return allWords;
}

export function getRandomWords(count, difficulty) {
  const source = difficulty ? getWordsByDifficulty(difficulty) : allWords;
  const shuffled = [...source].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getWordByText(wordText) {
  const key = wordText.toLowerCase().trim();
  return allWordsMap.get(key);
}

export function searchWords(query) {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return [];
  return allWords.filter(w => 
    w.word.toLowerCase().includes(searchTerm) || 
    w.meaning.toLowerCase().includes(searchTerm)
  );
}

// Export the raw data too
export const ALL_WORDS = allWords;
export const ONE_BEE_WORDS = getWordsByDifficulty(1);
export const TWO_BEE_WORDS = getWordsByDifficulty(2);
export const THREE_BEE_WORDS = getWordsByDifficulty(3);

console.log('Word data loaded with', allWords.length, 'words');
