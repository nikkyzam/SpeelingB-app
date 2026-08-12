# How to Add Your Word Files

## Step 1: Copy your JS files
Copy your 4 JS files to `src/data/`:

1. `word-concise-all-bee.js`
2. `word-two-bee-data.js`
3. `word-three-bee-data.js`
4. `word-one-bee-data.js`

## Step 2: Ensure proper export format
Each file should export an array of word objects. For example:

```javascript
// word-concise-all-bee.js
export default [
  {
    "word": "tag",
    "meaning": "A game in which one player chases the others...",
    "sentences": ["The children played a fast-paced game of tag..."],
    "vocabulary_question": "In the game of ███, does the person..."
  },
  // ... more words
]
