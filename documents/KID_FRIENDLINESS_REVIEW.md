# BrightHive: kid-friendliness review

Reviewed October 22, 2026.

Implementation update: the findings below describe the earlier app. See the [completed fixes and verification notes](/Users/havefaith/IdeaProjects/SpeelingB-app/documents/KID_FRIENDLINESS_FIXES.md) for the updated behavior.

The app has a warm foundation: large subject cards, a customizable mascot and world, short default word sets, encouraging error messages, spoken definitions, a “Show me” escape from learning checks, and reduced-motion styling. The biggest gains now come from clearer navigation, easier reading, dependable rewards, and giving children control over pace and sound.

## Scope

Reviewed the current source for the app shell, onboarding, learning and spelling, quiz and game access, representative games, subjects, reading, Bible, accounts, settings, and rewards. Inspected the running local app as a new guest on a desktop viewport and at 390 × 844 CSS pixels. This is a product and implementation review; it is not a complete playthrough of every game, a formal accessibility certification, or research with children. Recommendations about learning difficulty should be validated with children of the intended ages.

Existing uncommitted app changes were included in the review and left untouched. No app behavior was changed for this review.

Verification: the existing unit suite passed, **1,142 tests across 60 files**. Passing tests establish a useful functional baseline; they do not resolve the usability findings below.

## Fix first

### 1. Increase contrast on colored cards and buttons — High

White text on the default orange and green gradients is difficult to read. Calculated contrast against the default theme's solid gradient endpoints is approximately **2.03:1–2.61:1**. Both endpoints are below the normal-text baseline, and even below the large-text baseline. These are palette calculations, not a pixel audit of every gradient position.

Use dark text on the lighter fills, or darken fills sufficiently for white text. Introduce separate foreground tokens for each button/card tone rather than sharing white everywhere. Check every world, selected state, and text size.

Evidence: [default theme colors](/Users/havefaith/IdeaProjects/SpeelingB-app/src/theme/worlds.ts:75), [subject card styles](/Users/havefaith/IdeaProjects/SpeelingB-app/src/pages/Subjects/Subjects.css:80).

Acceptance: normal text reaches 4.5:1; qualifying large text reaches 3:1. These thresholds come from [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

### 2. Let grown-ups approve real-world prizes — High

The guest-accessible Settings screen lets a child put up ice cream, a later bedtime, or a custom sibling prize immediately. The shop also advertises real-world rewards without a family first agreeing to provide them. This can create promises the family never made.

Put prize creation and real-world reward availability in a separate grown-up area. Keep cosmetic choices easy for children to access. Let families choose the offered rewards; show a request as “Waiting for your grown-up” until approved, with a clear record of redemption.

Evidence: [prize setting](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/challenge/PrizeSetter/index.tsx:30), [Settings placement](/Users/havefaith/IdeaProjects/SpeelingB-app/src/pages/Settings/index.tsx:54), [default real rewards](/Users/havefaith/IdeaProjects/SpeelingB-app/src/services/rewards/RewardsDataService.ts:8).

### 3. Remove shop items whose promised effects do not work — High

The shop offers “Double Points” and “Free Hint,” but buying an item only deducts stars and records purchase history. There is no gameplay consumer of the `doublePoints` or `freeHint` effects in the current source. Children can spend their earned stars and receive no usable benefit.

Hide unsupported items until they work end to end. For working purchases, show what changes, the price in stars, and the balance afterward before committing. Provide an undo or refund for accidental spending. Apply the same ownership and usability check to avatars and themes.

Evidence: [power-up catalogue](/Users/havefaith/IdeaProjects/SpeelingB-app/src/services/rewards/RewardsDataService.ts:130), [purchase handler](/Users/havefaith/IdeaProjects/SpeelingB-app/src/stores/rewards/useRewardStore.ts:70), [immediate spending](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/rewards/RewardShop.tsx:43).

### 4. Curate actual book content before presenting it as a children's library — High

Online books are selected through broad searches; the Gutenberg query is for Christianity generally. Imported books receive broad, fixed age bands. Open Library entries can display generic invented pages, and later replace page one with a catalogue description rather than the book itself. A subject match does not establish reading level or suitability.

Default to reviewed books with verified text, age/reading-level metadata, and complete content. Clearly distinguish a book preview or description from a readable story. Require review before external titles enter the child's shelf. This finding identifies missing safeguards and misleading content handling; it does not establish that a particular fetched title is harmful.

Evidence: [external search](/Users/havefaith/IdeaProjects/SpeelingB-app/src/services/books/apiService.ts:92), [generated placeholder pages](/Users/havefaith/IdeaProjects/SpeelingB-app/src/services/books/apiService.ts:135), [fixed age band](/Users/havefaith/IdeaProjects/SpeelingB-app/src/services/books/apiService.ts:170), [description used as content](/Users/havefaith/IdeaProjects/SpeelingB-app/src/services/books/bookService.ts:65).

## Improve independent use

### 5. Add visible, separate controls for voice and effects — High

The shared audio provider exposes a mute function, but no screen calls it. Children therefore have no visible app sound switch. A single mute would also silence the pronunciation needed by spelling activities. The book reader uses its own speech path, disables its Listen button during speech, and provides no stop control or cancellation when leaving.

Offer “Read aloud” and “Game sounds” separately, plus an immediate Stop button and adjustable reading speed. Keep essential pronunciation available when celebration sounds are off. Use the shared speech controls in the reader and cancel narration on page changes and exit.

Evidence: [unused toggle](/Users/havefaith/IdeaProjects/SpeelingB-app/src/contexts/AudioContext/index.tsx:48), [reader audio](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/reading/BookReader.tsx:86).

### 6. Put the lesson and its next action higher on small screens — High

At 390 × 844, the first “tag” lesson places the top of “Got it!” at approximately **989 CSS pixels**, below the initial viewport. Large title and back-button panels consume space before the word; the bottom navigation overlays the lower part of the initial view.

Use a compact lesson header, smaller decorative gaps, and a clearly visible action area that respects the navigation and keyboard. Keep the word, brief meaning, replay, and next action close together. Preserve scrolling for larger text rather than forcing the whole lesson into a fixed height.

Evidence: [lesson layout](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/learning/LearnMode/LearnMode.css:1), [global layout](/Users/havefaith/IdeaProjects/SpeelingB-app/src/styles/global.css:144).

### 7. Make unlocking rules consistent and show playable choices first — High

The learning path says to learn the group, spell the group, and then play; its Play button requires the group to be spelled. Starter games follow a different rule, while other games need the daily quiz and possibly review. A new guest's Games page presents a long catalogue of locked activities, including a locked Game of the Day.

Use one shared description of the next requirement everywhere. Lead with available games, then a compact “More games to discover” section. Offer a short guided introduction with a small, explicitly taught starter set. Preserve practice value while avoiding a first visit dominated by locks.

Evidence: [learning path promises](/Users/havefaith/IdeaProjects/SpeelingB-app/src/pages/LearningHub/index.tsx:555), [learning Play gate](/Users/havefaith/IdeaProjects/SpeelingB-app/src/pages/LearningHub/index.tsx:628), [quiz/review rules](/Users/havefaith/IdeaProjects/SpeelingB-app/src/services/progress/LearningFlow.ts:351), [game explanations](/Users/havefaith/IdeaProjects/SpeelingB-app/src/pages/GameCenter/index.tsx:966).

### 8. Give practice a supported retry — Medium

Spell Mode accepts one scored answer per word. After a miss, it reveals the answer and offers Next Word; correcting the input cannot be checked. In the daily quiz, missed words rotate to the back until answered correctly, which can keep a child repeating the same difficult word.

In practice, offer “Try with help,” highlight the changed letters, and allow a supported spelling attempt. Keep first-attempt mastery distinct from assisted completion. Add a clear “Practice this later” route and save the quiz's remaining queue so stopping feels safe.

Evidence: [one-answer guard](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/learning/SpellMode/index.tsx:169), [Next Word behavior](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/learning/SpellMode/index.tsx:461), [quiz requeue](/Users/havefaith/IdeaProjects/SpeelingB-app/src/pages/DailyQuiz/index.tsx:243).

### 9. Make speed optional and add pause — Medium

Word Whack gives each target 3.5 seconds and defaults to a 45-second round. The game shell has Back but no common Pause control. Lessons also advance after some feedback, including correct spellings after 1.5 seconds.

Offer relaxed play and an optional challenge pace. Pause moving targets and timers during help, interruptions, or a hidden tab. Let children choose when to continue after feedback, especially when listening to an explanation. Essential timed games can keep their challenge mode alongside an untimed learning option.

Evidence: [target lifetime](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/games/WordWhack/index.tsx:31), [game shell](/Users/havefaith/IdeaProjects/SpeelingB-app/src/pages/GameCenter/index.tsx:1071), [automatic advance](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/learning/SpellMode/index.tsx:216).

Design reference: [W3C guidance on giving users enough time](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html). This is a recommendation, not a conformance verdict on every game.

### 10. Match the experience to reading ability — Medium

The home combines K–8 subjects, detailed subject blurbs, and a common interface. The easiest Bee tier still contains words such as the observed daily word “individual,” with an abstract definition. A reading age picker exists, but does not personalize the wider experience.

Ask a grown-up for an approximate learning stage and allow adjustment through actual performance. Provide an early-reader view with fewer choices, concrete vocabulary, pictures where useful, and shorter prompts. Give confident readers fuller subject choices without forcing a younger visual style. Use ability as well as age.

Evidence: [subject catalogue](/Users/havefaith/IdeaProjects/SpeelingB-app/src/services/subjects/catalogue.ts:57), [daily word selection](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/learning/WordOfTheDay/index.tsx:40).

### 11. Read instructions and questions aloud, not only answer words — Medium

Learning has strong word-level speech support, but subject questions and much of the navigation rely on reading. QuestionView renders prompts without a read-aloud action. A young child may understand the subject but be unable to decode the task.

Provide a consistent speaker beside instructions, prompts, hints, and eligible answer choices. Introduce each unfamiliar game with one demonstrated turn. For reading-assessment activities, let the grown-up decide which text may be narrated.

Evidence: [question prompt](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/subjects/QuestionView/index.tsx:235).

### 12. Put books first and show local books immediately — Medium

Reading opens with statistics, feature descriptions, age and grade controls, categories, and search before the shelf. Local books wait for online discovery to finish, even though local stories are already available. Network fetches have no explicit timeout here.

Lead with “Continue reading” and a short row of suitable covers. Collapse filters and move parent tips into grown-up help. Render local books immediately, fetch extras in the background, and provide a friendly retry message if online discovery fails. Remember the selected reading stage.

Evidence: [reading page ordering](/Users/havefaith/IdeaProjects/SpeelingB-app/src/pages/ReadingHub.tsx:45), [blocking online fetch](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/reading/BookShelf.tsx:31).

### 13. Make accounts and permissions a grown-up task — Medium

The front door offers Sign In, and account creation asks “Your Name,” email, and password without identifying the flow as grown-up setup. Startup also calls the browser notification permission request before a child has chosen a reason to receive notifications. Microphone recognition errors simply stop listening without explaining what happened.

Keep a clear guest play path. Label account setup “Ask a grown-up to save your progress,” support nicknames, and explain where progress is stored in plain language. Request notifications only from an explicit grown-up choice. Explain microphone use before activation and show a helpful typing fallback after permission or recognition failure. This is a product recommendation, not a legal compliance assessment.

Evidence: [account wording](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/auth/AuthModal.tsx:90), [startup permission](/Users/havefaith/IdeaProjects/SpeelingB-app/src/App.tsx:98), [speech recognition](/Users/havefaith/IdeaProjects/SpeelingB-app/src/hooks/useSpeechRecognition.ts:62).

### 14. Complete keyboard and assistive-technology support — Medium

The account modal lacks dialog semantics, focus management, and Escape handling; its visual form labels are not associated with inputs. The world picker declares a modal but does not move or contain focus. Reader vocabulary uses clickable spans rather than buttons.

Use a shared accessible dialog with a name, initial focus, contained Tab navigation, Escape where dismissal is allowed, and focus restoration. Associate every input with its label. Use real buttons for interactive text and announce changes such as purchase results and microphone errors.

Evidence: [account modal](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/auth/AuthModal.tsx:87), [world modal](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/theme/WorldPicker.tsx:76), [reader vocabulary action](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/reading/BookReader.tsx:100).

### 15. Enlarge small secondary controls — Medium

Large activity buttons are a strength, but small controls still need attention. For example, the custom keypad's hide button is only 1.6rem high, and the small-screen navigation labels are 0.66rem. Dense letter grids also need testing with long words and small hands.

Adopt at least a 44 × 44 CSS-pixel target as a child-friendly design goal, with extra spacing for frequent or consequential actions. Enlarge labels independently of icons. Offer simpler grids or zoom where a puzzle cannot fit comfortably.

Evidence: [keypad hide button](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/common/SpellingInput/SpellingInput.css:72), [mobile navigation](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/layout/Navigation/Navigation.css:64).

The 44-pixel recommendation follows [W3C's enhanced target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html), which is Level AAA; it should not be confused with the AA minimum.

## Build trust and a calmer experience

### 16. Make every star promise accurate — Medium

The shop says correct spellings earn 10 stars and mini-games earn 15–30. Current Spell Mode awards one star per correct word; GameCenter caps a normal finished game at five before the featured-game multiplier. The shop's instructions therefore set expectations gameplay does not meet.

Generate earning descriptions from the same rules that award stars. Use one child-facing term, “stars,” throughout. Show the amount actually earned at the end of each activity.

Evidence: [earning tips](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/rewards/RewardShop.tsx:155), [spelling payout](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/learning/SpellMode/index.tsx:187), [game payout cap](/Users/havefaith/IdeaProjects/SpeelingB-app/src/pages/GameCenter/index.tsx:88).

### 17. Celebrate effort and make stopping comfortable — Enhancement

Home and Games emphasize streaks, daily surprises, challenges, and “JACKPOT” rewards. The app also already has useful counterbalances: positive missed-answer language, a streak freeze, and a cooperative sibling mode.

Offer a calm preference with fewer effects, a simple earned gift instead of jackpot language, and an obvious “Great work—done for today” finish. Treat missed days neutrally. Promote Team Relay alongside competitive modes, and let families hide real-world competition prizes. A favorite game should remain easy to find without daily reward panels dominating the visit.

Evidence: [mystery-box wording](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/rewards/MysteryBox/index.tsx:13), [wheel wording](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/games/PrizeWheel/index.tsx:24), [sibling modes](/Users/havefaith/IdeaProjects/SpeelingB-app/src/pages/SiblingChallenge/index.tsx:29).

### 18. Replace adult-facing and technical wording on child screens — Enhancement

The Bible page exposes “Clear Cache,” “API Information,” and connection/cache details. Elsewhere, “Learning Hub,” “vocab,” “XP,” “redeem,” rarity labels, and multiple simultaneous progress systems add interpretation work. The Spelling home alone offers ten activity cards after several progress and reward sections.

Use “Bible stories,” “Hear a verse,” “My words,” “Use 50 stars,” and “Choose a game.” Move diagnostics to grown-up support. Keep one main progress story visible at a time; put detailed totals behind an optional progress view. Retain the existing Next Up action as the main route through spelling.

Evidence: [Bible diagnostics](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/bible/BibleApiDashboard/index.tsx:285), [cache control](/Users/havefaith/IdeaProjects/SpeelingB-app/src/components/bible/BibleApiDashboard/index.tsx:136), [Spelling choices](/Users/havefaith/IdeaProjects/SpeelingB-app/src/pages/Home/index.tsx:60).

## Suggested delivery order

1. **Trust and access:** fix contrast, add usable audio controls, restrict real-world prize setup, remove nonfunctional shop items, and default the library to reviewed content.
2. **Daily usability:** compact the lesson layout, unify game access messages, lead with playable choices, add supported retries and relaxed pacing, and show local books immediately.
3. **Personalization and polish:** learning-stage preferences, spoken instructions, accessible dialogs and larger secondary controls, accurate reward descriptions, simpler child-facing copy, and a calm finish to each session.

## Validation before calling the experience ready

- Watch children from the intended age range choose an activity, finish a short lesson, recover from a mistake, stop sound, and stop playing without adult explanation. Ask the grown-up to set a prize separately.
- Check phone and tablet portrait/landscape layouts, larger text, keyboard-only navigation, and a screen reader. Include long words and the touch keypad on an actual touch device.
- Verify that every visible shop item delivers its advertised result and accidental spending can be recovered.
- Verify every world’s text contrast and essential information beyond color alone.
- Try interrupted and unavailable audio, a denied microphone, slow/offline reading, and leaving mid-quiz or mid-game. Returning should show a clear next step and preserved progress where promised.
- Confirm that children can explain what opens a game after reading the message once, and that it matches what actually happens.
