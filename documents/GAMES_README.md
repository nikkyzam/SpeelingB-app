# Spelling Game Suite 🎮

A collection of educational spelling and vocabulary games built with React and TypeScript.

## Games Included

### 1. 🔤 Word Scramble
- **Description**: Unscramble letters to form words
- **Features**: Timer, scoring system, hints, streak bonuses
- **Difficulty**: Easy/Medium/Hard
- **Duration**: 45 seconds

### 2. ⚡ Spell Sprint
- **Description**: Race against time to spell as many words as possible
- **Features**: Real-time typing, combo system, WPM tracking
- **Difficulty**: Medium/Hard
- **Duration**: 60 seconds

### 3. 🔺 Shape Catcher
- **Description**: Catch falling shapes with correct letters
- **Features**: Falling shapes, lives system, letter recognition
- **Difficulty**: Easy/Medium
- **Duration**: 60 seconds

### 4. 🗺️ Spelling Adventure
- **Description**: Progressive adventure through multiple levels
- **Features**: Multiple challenge types, level progression, lives system
- **Difficulty**: Easy/Medium/Hard
- **Duration**: 180+ seconds

### 5. 🔍 Word Search (Existing)
- **Description**: Find hidden words in a grid
- **Features**: Multiple grid sizes, hint system, timer

### 6. 🏎️ Vocabulary Race (Existing)
- **Description**: Race to match words with definitions
- **Features**: Multiplayer support, timed challenges

### 7. ❓ Missing Letters (Existing)
- **Description**: Fill in missing letters in words
- **Features**: Progressive difficulty, hint system

### 8. 🔄 Word Match (Existing)
- **Description**: Match words with their definitions
- **Features**: Card matching, timer, scoring system

## The Play Pack (10 newer games)

Ten games added to widen the *kinds* of play on offer — arcade, boss battle,
board game, story-making and ear training — not just more "tap the letters".
Every one draws from the words the child has already studied, is theme-aware,
and reports a score so it can be beaten next time.

| Game | What you do | Skill it builds |
| --- | --- | --- |
| ⚙️ **Word Machine** | Feed in one of your words and pick what comes out when there are two: boxes not boxs, babies not babys, mice not mouses. The wrong answers are the other rules applied, and the rule is spelled out after every answer. Words the rules can't handle safely are left out rather than taught wrong. | Plural spelling rules: +s, +es, y→ies, f→ves, irregulars |
| 🐉 **Dragon Duel** | Turn-based boss fight: spell to strike, miss and the dragon breathes fire. Three in a row lands a critical hit. A potion reveals the first letter. | Listening then spelling from memory |
| 🔨 **Word Whack** | Whack-a-mole where bugs carry misspelled words and bees carry correct ones. Bonk the bugs only. | Proofreading at speed |
| 🎣 **Word Fishing** | The end of the word swam off — hook the fish carrying the piece that completes it. | Word chunks, listening |
| 🎤 **Rhyme Time** | Pick the word that rhymes. Uses curated rhyme families plus the child's own words when they genuinely rhyme. | Phonics, ear training |
| 🏰 **Spell Tower** | Every word spelled right adds a floor to a tower; three wobbles knocks the top block off. | Spelling with a visible reward |
| 🧺 **Word Sort** | Two baskets, one rule ("starts with a vowel", "has double letters"…). Sort each word into the right one. | Noticing word shape |
| 🦜 **Parrot Party** | Simon-says with words: Polly says a growing sequence, you tap it back. One free "listen again" per run. | Working memory, word recognition |
| 📜 **Silly Story** | Fill the blanks of a story with your own words, then hear the whole thing read out. Optional spelling bonus round. | Vocabulary in context, reading aloud |
| 🗺️ **Treasure Trail** | Roll the dice along a 12-tile map; each tile is a small puzzle (right spelling / missing letter / matching meaning). | Mixed practice, persistence |

### Hub features that go with them

- **Daily Prize Wheel** — one free spin a day, every slice wins stars. No blanks:
  a wheel that can land on "nothing" is a wheel a child stops trusting.
- **Personal bests** — each game remembers your top score; the card shows it and
  the play button becomes "Beat your best!". Beating it pops a fanfare.
- **Favourites** — tap ☆ on any card to pin a game to the top of the hub.
- **Category filters** — All / Favourites / Spelling / Listening / Arcade /
  Puzzles / Bible.
- **Daily challenge** — play 3 *different* games in a day for 25 bonus stars.
  Progress is counted from games actually finished, not a mock-up.
- **Sound effects** — a shared `sfx` kit (Web Audio, no asset files) for correct,
  wrong, pop, whoosh, thud, star, win and fanfare. Honours the same mute switch
  as the spoken words.

Shared code lives in `src/components/games/shared/` (`wordTricks.ts` for
misspellings, rhymes and chunking, `sfx.ts` for sound) and
`src/services/games/GameStats.ts` (bests, play counts, favourites, daily challenge).

## Installation

```bash
# Make scripts executable
chmod +x create-games.sh update-games.sh install-games.sh

# Run installation
./install-games.sh
