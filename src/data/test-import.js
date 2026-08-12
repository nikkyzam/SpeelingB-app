// Test that the import works
import { UNIQUE_WORDS, STATS } from './importWords.js';

console.log('=== Word Import Test ===');
console.log('Total unique words:', STATS.totalWords);
console.log('One Bee words:', STATS.oneBeeCount);
console.log('Two Bee words:', STATS.twoBeeCount);
console.log('Three Bee words:', STATS.threeBeeCount);
console.log('Source breakdown:', STATS.sources);
console.log('First few words:', UNIQUE_WORDS.slice(0, 5));
console.log('=== End Test ===');
