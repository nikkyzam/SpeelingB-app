# 🎉 Fun Features — Requirements Document

**Product:** Kids Spelling Bee (SpeelingB-app)
**Purpose:** A prioritized, code-free requirements backlog of *new* ideas to make the
app more delightful for children. Everything here is **in addition to** what already
ships (buddy, wardrobe, quest map, mystery box, word cards, seasonal events,
spell-by-speaking, sibling showdown, silly sentences, word hunt, celebration
variety, world sounds, 30+ games).

**How to read this document:**
Each feature has a goal, kid-facing story, functional requirements, acceptance
criteria, effort estimate, and priority. Effort is T-shirt sized
(**S** < 1 day, **M** 1–3 days, **L** 3–7 days, **XL** > 1 week).

---

## 0. Design Principles (apply to every feature)

| # | Principle | Rule |
|---|-----------|------|
| P1 | **No guilt mechanics** | Nothing decays, starves, expires, or scolds. Absence is never punished. |
| P2 | **Learning is the currency of progress** | Stars and unlocks come from learning, never from waiting or paying. |
| P3 | **Word scoping** | Activities use words the child has met; strangers' words stay out of games. |
| P4 | **Safe by default** | No open chat, no public profiles, no external links for kids. COPPA-conscious: minimal data, local-first. |
| P5 | **Readable aloud** | Every screen must work for a pre-reader: icons first, TTS available. |
| P6 | **One-thumb playable** | Big targets (≥ 56 px), bottom-half reachable on a tablet held by small hands. |
| P7 | **Celebration over correction** | Wrong answers get encouragement and scaffolding, never buzzers or red X spam. |

---

## 1. Feature Backlog

---

### F1 — 🏆 Spelling Bee Tournament Mode

**Priority:** P0 (do first) · **Effort:** M · **Theme:** Achievement

**Goal.** Recreate the real spelling-bee experience — rounds, rising tension, a
trophy — as the app's flagship event.

**Kid story.** "I enter the Bee, the words get harder each round, the crowd goes
wild, and if I win I get a giant trophy in my room!"

**Functional requirements.**

1. Tournament bracket of 5 rounds: Warm-up (3 easy words) → Qualifier →
   Semi-final → Final → Championship word.
2. One miss = lose a "wing" (2 wings per tournament; losing both ends the run
   kindly: "You spelled 14 words! The trophy will wait for you!").
3. Words are drawn from the child's spelled/mastered pool first, then one
   difficulty tier above their setting for finals (stretch, not punishment).
4. Round ceremony: announcer-style TTS ("Round three! Your word is…"),
   audience sound (synthesized claps via Web Audio), spotlight visual.
5. Winning awards a **trophy item** (new reward category) + stars + confetti
   cannon celebration variant.
6. Weekly "Grand Bee": a seeded bracket that resets each Monday, with the
   child's best round tracked as a personal record.
7. Optional pass-and-play: two kids share a bracket (builds on Sibling Showdown).

**Acceptance criteria.**

- A full tournament completes in under 8 minutes.
- Losing a run never shows failure language; the summary always celebrates words spelled.
- Trophy appears in a new Trophy Room (see F2) immediately after winning.
- Works fully offline; no account required.

---

### F2 — 🖼️ Trophy Room & Achievement Gallery

**Priority:** P0 · **Effort:** M · **Theme:** Achievement

**Goal.** Give every accomplishment a *place to live* that kids can visit and
show off — badges currently unlock silently in a list.

**Kid story.** "This is MY room. That gold cup is from the Grand Bee, and that
plaque is because I learned 100 words!"

**Functional requirements.**

1. New `/trophies` page styled as a 3D-ish shelf room in the child's world theme.
2. Trophy types: tournament cups (bronze/silver/gold by round reached),
   milestone plaques (50/100/250/500 words), event medals (seasonal),
   kindness badges (helping the buddy, feeding streaks).
3. Each trophy is tappable: plays a short animation + TTS of how it was earned,
   with the date earned.
4. Empty shelf slots shown as silhouettes with hints ("Win the Grand Bee to
   earn this!") — anticipation, not pressure.
5. "Show a grown-up" button: fullscreen rotates the room slowly with big text
   for sharing with parents.
6. Buddy appears in the room wearing equipped wardrobe items.

**Acceptance criteria.**

- Every existing badge maps to a shelf item (migration on first open).
- Silhouette hints never show a countdown or deadline.
- Room renders at 60 fps with ≥ 30 trophies.

---

### F3 — 🏡 Buddy's Home (Decorate a Room)

**Priority:** P1 · **Effort:** L · **Theme:** Emotional connection

**Goal.** Extend the buddy from a companion into a *place*: a room the child
decorates with stars, turning the reward economy into creative expression.

**Kid story.** "I bought my buddy a rainbow rug and a bookshelf! His room is
the coziest!"

**Functional requirements.**

1. New `/buddy-home` page: a simple room scene (wall, floor, 8–10 anchor slots).
2. Decor catalog (30+ items): rugs, posters, plants, toys, windows, beds —
   each with 2–3 color variants. Priced in stars (15–200).
3. Drag-and-drop placement; items snap to anchor slots; tap item to
   bounce/wiggle it.
4. Buddy lives in the room and reacts to items ("I love my new poster!").
5. Seasonal decor items appear in the shop only during seasonal events
   (pumpkin in October, tree in December) — ties into the existing seasonal system.
6. Room state persists locally and syncs via existing FirebaseSync.

**Acceptance criteria.**

- Placing/moving/removing an item takes ≤ 2 taps.
- All decor purchasable with earned stars; no premium-only items.
- Room renders correctly in all 8 world themes (items tint to palette).

---

### F4 — 📖 Story Mode: The Word Quest

**Priority:** P1 · **Effort:** XL · **Theme:** Narrative

**Goal.** Wrap learning in an ongoing story — a reason to come back that isn't
a streak number.

**Kid story.** "The Word Dragon scattered all the words! Every word I spell
brings one back to the storybook village!"

**Functional requirements.**

1. A 10-chapter illustrated story (simple SVG scenes + TTS narration), one
   chapter per ~20 words learned.
2. Each chapter ends with a "story choice" that uses 3 words the child learned
   that week ("Should the hero cross the **bridge** or climb the **mountain**?").
3. Choices visibly change the next chapter's illustration (2 variants per
   chapter, pre-authored).
4. Chapter unlock = spelled the required words; re-reading unlocked chapters
   is always free.
5. Villain (Word Dragon 🐉) ties into the existing Dragon Duel boss game:
   chapters 5 and 10 end with a Dragon Duel battle.
6. Completion reward: "Keeper of Words" trophy (F2) + special buddy aura.

**Acceptance criteria.**

- A chapter is ≤ 3 minutes of listening.
- Story is fully voice-narrated (TTS) for pre-readers.
- Choices persist; re-reading shows the child's chosen variant.

---

### F5 — 🎤 Voice Studio (Record & Play Back)

**Priority:** P1 · **Effort:** M · **Theme:** Expression

**Goal.** Let kids hear *themselves* — record reading a word or silly sentence,
play it back, giggle, learn.

**Kid story.** "I said 'hippopotamus' and now I can hear ME saying it! I sound
so funny!"

**Functional requirements.**

1. Record button on word cards and Silly Sentences: captures up to 10 seconds
   via MediaRecorder.
2. Playback with fun voice effects: chipmunk (fast), giant (slow), robot
   (bitcrush) — pure Web Audio processing, no server.
3. "Did it match?" self-check: play the TTS version, then the child's version.
4. Recordings stored locally (IndexedDB), deletable individually or all at once;
   never uploaded.
5. Optional: attach a recording to a word card as its "my voice" badge.
6. Microphone permission flow with a friendly explainer screen; app fully
   functional if denied.

**Acceptance criteria.**

- Recording starts within 300 ms of tap.
- Permission denial shows encouragement + alternative, never an error wall.
- All processing on-device; zero network calls.

---

### F6 — 👨‍👩‍👧 Family Rally (Weekly Household Leaderboard)

**Priority:** P2 · **Effort:** L · **Theme:** Social (safe)

**Goal.** Siblings and parents play *together* on shared devices — a gentle,
same-household competition.

**Kid story.** "Me and Dad are on the Word Wall! I'm beating him by 40 stars!"

**Functional requirements.**

1. Up to 6 local profiles on one device (extends the existing WhoIsPlaying
   switcher) with avatar + color.
2. Weekly Rally board: words learned, words spelled, stars earned — reset every
   Monday with a celebration for *everyone* ("You all spelled 82 words!").
3. Team goal variant: the whole family fills one shared progress bar to unlock
   a group reward (e.g., a new decor item for every buddy).
4. Profile switcher uses picture passwords (pick your animal + color), never
   typed credentials for kids.
5. A grown-up profile can view each child's progress report.
6. No network multiplayer; household-only by design (P4).

**Acceptance criteria.**

- Switching profiles takes ≤ 3 taps and no typing.
- Weekly reset celebrates participation, never ranks a loser.
- Data isolation: one child's words/stars never leak into another's.

---

### F7 — 🖨️ Printable Adventure Packs

**Priority:** P2 · **Effort:** S–M · **Theme:** Offline bridge

**Goal.** Bridge screen time to paper — printables generated from the child's
*own* word list.

**Kid story.** "Mum printed my words and we played word bingo at breakfast!"

**Functional requirements.**

1. "Print" button (grown-up gated) on Word Collection generating a PDF:
   - Flashcards (word front / meaning + picture-emoji back)
   - Word search grid from this week's words
   - Handwriting practice sheet (dotted-trace letters)
   - Bingo cards (2 per page)
2. Uses the child's current word group and tricky words (ReviewSchedule).
3. Seasonal variants during events (Halloween word search, etc.).
4. PDF opens in a new tab for printing; no account, no upload.
5. Optional QR code on the sheet linking back to the app (for classroom use).

**Acceptance criteria.**

- PDF generates in < 3 seconds for 20 words.
- Print layout correct on Letter and A4.
- All generation client-side.

---

### F8 — 🎵 Word Songs & Chants

**Priority:** P2 · **Effort:** M · **Theme:** Audio delight

**Goal.** Some kids learn by singing. Turn the week's words into a chant.

**Kid story.** "The app sings MY words! B-A-L-L, ball, ball, BALL!"

**Functional requirements.**

1. "Sing my words" button on the Learning Hub: generates a chant of the current
   group's words (TTS with rhythm + a simple synth backing loop).
2. Three musical styles: march, lullaby, hip-hop clap (tempo + instrument
   changes via existing sfx engine).
3. Spell-along mode: the chant pauses before each word's letters so the child
   shouts them first.
4. Karaoke text: word letters highlight in sync on screen.
5. Respects the global audio toggle; volume slider on the player.

**Acceptance criteria.**

- Letter sync accurate to ±150 ms.
- Works for any group size 3–12 words.
- Fully synthesized; no audio file downloads.

---

### F9 — 🐣 Buddy Mini-Games (Care Through Play)

**Priority:** P2 · **Effort:** L · **Theme:** Emotional connection

**Goal.** Deepen the buddy bond with 3 tiny games that cost stars *nothing* and
reward snacks (learning currency), never competing with learning.

**Kid story.** "I played fetch with my buddy and he did a backflip!"

**Functional requirements.**

1. **Fetch:** throw a ball (flick gesture), buddy chases it; buddy speed scales
   with happiness.
2. **Hide & Seek:** buddy hides behind one of 3 objects in Buddy's Home (F3);
   child taps to find; 3 rounds.
3. **Snack Catch:** buddy catches falling snacks (tilt or arrows); snacks caught
   become real feedable snacks (capped at 3/day so it supplements, not
   replaces, learning).
4. Each game ≤ 60 seconds, no fail state, ends with a buddy reaction.
5. Happiness nudges up per play (respects the no-decay rule, P1).

**Acceptance criteria.**

- No way to grind stars from these games.
- Each game playable with one hand, no reading required.
- Games unlock with buddy stage 2+ (a reason to grow the buddy).

---

### F10 — 🧭 Word Worlds: Unlockable Map Regions

**Priority:** P3 · **Effort:** XL · **Theme:** Progression

**Goal.** Make the Quest Map *explorable* — earned regions that open new
scenery, not just a line of nodes.

**Kid story.** "I finished Rainbow Falls and now I'm exploring the Cookie
Caves! There's a treasure chest here!"

**Functional requirements.**

1. The quest trail is grouped into named regions (8–10 groups each), each with
   unique scenery, ambient sound (extends world sounds), and a treasure chest
   at the end.
2. Chests contain decor (F3), wardrobe, or a trophy (F2) — never consumable filler.
3. A world-map overview page shows regions as islands; finished regions gold,
   current highlighted, future ones clouded.
4. Region completion ceremony: short cutscene (mascot travels to new island).
5. Requires no new learning content — regions re-skin the existing word
   progression.

**Acceptance criteria.**

- Map state derives from existing progress data (no new tracking to migrate).
- A child always knows their next unlock ("3 more groups to the Cookie Caves!").
- Map is navigable by swipe and tap, no pinch-zoom required.

---

### F11 — 📸 Grown-Up Corner 2.0 (Progress Reports)

**Priority:** P2 · **Effort:** M · **Theme:** Trust

**Goal.** Parents get real insight without interrupting play — which also makes
them champions of the app.

**Requirements.**

1. PIN-gated grown-up area (simple 4-digit PIN, set on first open).
2. Weekly report card: words learned/spelled/mastered trend (7/30-day chart),
   accuracy by difficulty, trickiest 5 words, time-of-day pattern.
3. "Celebrate this" highlight: auto-picks the week's best moment ("Tuesday:
   12 words in one day! 🎉") phrased for sharing with the child.
4. Controls: daily goal, difficulty cap, audio on/off, reset options.
5. Export: one-tap PDF/CSV of the report.
6. All data already local; report renders from existing stores (no new tracking).

**Acceptance criteria.**

- PIN never blocks the child from playing; only gates the report.
- Every number on the report cites its source data (hover/tap reveals).
- Charts readable in 5 seconds (max 3 per screen).

---

### F12 — 🌈 Kindness Quests (Pro-social Play)

**Priority:** P3 · **Effort:** S · **Theme:** Values (fits the faith-based ethos)

**Goal.** Small real-world kindness tasks that earn in-app warmth, not stuff.

**Kid story.** "I gave my brother a hug and the app drew a heart on my day!"

**Functional requirements.**

1. One optional kindness prompt per day ("Thank someone who helped you",
   "Share a toy", "Say a prayer for a friend") — appears on Home, dismissible.
2. Completing (honor system, one tap "I did it!") draws a heart on a weekly
   kindness calendar — no stars, no shop items (keeps it genuine).
3. 7 hearts = a "Kind Heart" badge for the Trophy Room (F2).
4. Prompts vetted, faith-friendly, and editable by grown-ups (F11 settings).

**Acceptance criteria.**

- Never required for progression; no streak loss.
- Prompt list localizable and parent-editable.
- Calendar shows hearts for *days done*, never "missed" marks.

---

### F13 — 🎨 Draw-a-Word Canvas

**Priority:** P3 · **Effort:** M · **Theme:** Creativity

**Goal.** Kinesthetic learners draw the word they just learned.

**Kid story.** "I drew the word 'rainbow' AS a rainbow!"

**Functional requirements.**

1. After mastering a word, "Draw it!" appears on its card: fullscreen canvas,
   12 chunky colors, 3 brush sizes, sticker stamps (world sprinkles).
2. The word traces faintly underneath as a guide (toggleable).
3. Save to a gallery on the word card (max 3 per word, oldest auto-archived).
4. Gallery wall page: all drawings in a museum grid; tap to hear the word.
5. Drawings stored locally (IndexedDB, compressed), never uploaded.

**Acceptance criteria.**

- Canvas works with finger and mouse; ≥ 30 fps stroke rendering.
- Total storage per drawing < 150 KB.
- No drawing tools behind any paywall/gate.

---

### F14 — 🧑‍🏫 Classroom & List Sharing (Teacher Mode)

**Priority:** P3 · **Effort:** L · **Theme:** Reach

**Goal.** Teachers and homeschool parents assign this week's spelling list and
watch the class play it.

**Requirements.**

1. Grown-up creates a custom word list (type or paste; up to 30 words) with
   auto-generated meanings/sentences where missing (TTS-friendly templates).
2. List gets a 6-character share code; entering it on any device imports the
   list as a special quest group.
3. Optional Firebase-backed sync for classroom dashboard (opt-in; app remains
   fully functional offline/local).
4. Class board: first names + progress bars only (no messages, no chat — P4).
5. Lists appear in the child's world/theme like any seasonal set.

**Acceptance criteria.**

- Import via code takes < 30 seconds.
- Custom lists flow through the exact same learn → spell → game chain.
- Classroom dashboard is read-only for students.

---

### F15 — 🕹️ Daily Game Rotation & "Game of the Day"

**Priority:** P1 · **Effort:** S · **Theme:** Freshness

**Goal.** With 30+ games, kids need a nudge to discover beyond their favorite
two.

**Requirements.**

1. Game Center header shows a "Game of the Day" — deterministic per date
   (every device shows the same game that day) with a 2× stars bonus.
2. A subtle "NEW" / "Haven't tried yet" ribbon on unplayed games.
3. After finishing any game, a "Next up: try [game]!" card recommends an
   unplayed game from a different category.
4. Rotation respects unlock rules (only recommends unlocked games).

**Acceptance criteria.**

- Same date → same Game of the Day across devices (no RNG drift).
- Bonus applies once per day.
- Recommendation never repeats the just-played game.

---

## 2. Prioritization Matrix

| Feature | Kid delight | Retention pull | Effort | Priority |
|---|---|---|---|---|
| F1 Bee Tournament | ★★★★★ | ★★★★ | M | **P0** |
| F2 Trophy Room | ★★★★ | ★★★★★ | M | **P0** |
| F3 Buddy's Home | ★★★★★ | ★★★★ | L | P1 |
| F4 Story Mode | ★★★★★ | ★★★★★ | XL | P1 |
| F5 Voice Studio | ★★★★★ | ★★★ | M | P1 |
| F15 Game of the Day | ★★★ | ★★★★ | S | P1 |
| F6 Family Rally | ★★★★ | ★★★★ | L | P2 |
| F7 Printable Packs | ★★★ | ★★ (parent ★★★★★) | S–M | P2 |
| F8 Word Songs | ★★★★ | ★★★ | M | P2 |
| F9 Buddy Mini-Games | ★★★★ | ★★★ | L | P2 |
| F11 Grown-Up Corner 2.0 | ★ (parent ★★★★★) | ★★★ | M | P2 |
| F10 Word Worlds | ★★★★★ | ★★★★ | XL | P3 |
| F12 Kindness Quests | ★★★ | ★★ | S | P3 |
| F13 Draw-a-Word | ★★★★ | ★★★ | M | P3 |
| F14 Classroom Mode | ★★★ | ★★★★ (teacher) | L | P3 |

**Suggested sequence:** F15 (quick win) → F1 + F2 (they ship best together:
tournament earns the trophy, the room shows it) → F5 → F3 → F4 (the big
narrative investment once the world is rich) → the rest by audience demand.

---

## 3. Cross-Cutting Requirements

### Technical
- **Offline-first:** every feature must work without network (except F14's
  optional class sync). No new hard dependencies on Firebase.
- **Performance:** 60 fps on a 2019-era tablet; total JS bundle growth
  budgeted at +300 kB gzip across all P0–P1 features (code-split per feature).
- **Storage:** localStorage for state, IndexedDB for media (recordings,
  drawings); every feature needs a storage budget and eviction policy.
- **Theming:** all visuals consume world CSS custom properties; test all 8 worlds.

### Safety & Privacy
- No open text/chat between users, ever (P4).
- Microphone and drawings never leave the device (F5, F13).
- Analytics, if added, must be aggregate-only and disclosed to grown-ups.

### Accessibility
- All interactions reachable by switch/tap; no drag-only mechanics without a
  tap alternative.
- Full TTS coverage for new text (P5).
- Respect `prefers-reduced-motion` for every new animation.

### Measurement (what "fun" means, in numbers)
- **Discovery:** % of sessions that open ≥ 2 different activities.
- **Return:** day-1 / day-7 return rate (local telemetry only).
- **Delight proxy:** buddy pokes, silly-sentence reads, celebration replays.
- **Learning guardrail:** fun features must not reduce words-learned-per-session
  by more than 5% — fun feeds learning, never replaces it.

---

*Drafted 2026-09-06 · Ideas only — no implementation commitments. Effort
estimates assume the existing architecture (zustand stores, localStorage
services, world theming, sfx engine).*
