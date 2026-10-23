# Kid-friendliness fixes

This implements the 18 findings from the [review](/Users/havefaith/IdeaProjects/SpeelingB-app/documents/KID_FRIENDLINESS_REVIEW.md). Existing private-word-list work has been preserved.

| Finding | Implemented behavior |
| --- | --- |
| 1. Contrast | Action gradients support white text across all eight worlds; separate readable ink colors support text on cards. Automated palette checks cover all worlds. |
| 2. Real-world prizes | A device family PIN protects grown-up tools. Family rewards start empty. A child requests an offered reward; stars are used only after approval. Approved but unfulfilled requests can be cancelled and refunded. Existing sibling prizes require renewed grown-up approval. |
| 3. Nonfunctional shop items | The old power-ups, themes and other unsupported purchases are no longer sold. Older unsupported purchases return their stars once when the shop opens. Buddy items equip immediately after a price/balance confirmation, with an undo action. |
| 4. Book content | The child library and deep links use the bundled story collection only. External searches cannot introduce unverified stories. Catalogue converters no longer invent filler pages. Bundled stories are labelled as BrightHive retellings. |
| 5. Audio | Voice and effects have separate controls. The header exposes sound controls and Stop voice. Settings adds reading speed. Story narration has an immediate Stop button and stops when changing pages or leaving. Unsupported speech has a friendly fallback message. |
| 6. Mobile lesson | The lesson header is compact. At 390 × 844 the first word, meaning, sentence and Got it action are visible together. |
| 7. Game access | The learning path, Home and game hub explain starter games versus the quiz/review requirement. Optional spelling practice no longer adds a second gate to the hub's Play button. Available games appear first; locked games are behind More games to discover. A locked game is not featured. |
| 8. Supported retry | Practice offers Try with help after a miss. Assisted attempts do not receive independent-mastery credit or spelling stars. Quizzes save their remaining queue, provide practice help, and have a Stop for now action. |
| 9. Pace and pause | Manual continuation is the lesson/quiz default. Relaxed rounds remove countdowns in timed word and number rounds; Ghost Word waits until the child is ready to hide the word. Movement-heavy games slow down. Word, topic, math and sibling game shells offer pause; shared game timers retain remaining time during pauses and hidden tabs. |
| 10. Learning stage | Grown-up settings offers early, growing and confident reader stages. Early mode uses a concrete starter vocabulary with short meanings, sentences and pictures, fewer home choices, and younger math choices. Existing competition lists omit most basic starter words, so missing starter words now have stable IDs and resolve in saved progress and games. |
| 11. Spoken instructions | Home and lessons provide instruction replay. Subject questions and eligible choices can be read aloud. Early mode reads new instructions automatically. Games offer paused help and a no-score warm-up example. |
| 12. Books first | The shelf appears immediately with locally available stories. Level/search controls and grown-up reading tips are folded away. Reading level and the last story/page are remembered. |
| 13. Accounts and permissions | Saving family progress is a grown-up flow, with a grown-up email and a child's nickname. Guest play remains available. Startup no longer requests notification permission. Microphone use is explained before activation; denied or failed recognition offers typing instead. |
| 14. Keyboard access | Shared dialogs have names, contained focus, Escape dismissal where appropriate, background isolation, and focus restoration. Nested dialogs restore the background correctly. Account labels identify their inputs. Reader vocabulary uses keyboard-operable buttons. |
| 15. Small targets | Secondary controls and keypad dismissal have larger targets. The letter keypad uses six-letter rows to support wider keys. Word Search supports scrolling a grid of 44-pixel cells. Word Whack uses fewer columns for long words instead of shrinking them to tiny type. |
| 16. Star promises | Shop descriptions use the same spelling/game reward constants as gameplay. Refunds restore the spendable balance without inflating lifetime learning totals. The repeated hidden streak bonus on each star award was removed, so displayed awards match the balance change. |
| 17. Calmer finish | Calm mode suppresses effects and sounds. Daily gifts are optional, jackpot wording is removed, and celebrations wait for the child. Finish screens offer a clear stopping point. Team Relay leads sibling choices. |
| 18. Child-facing language | Learning Hub becomes My words; reward language uses stars; learning points replaces XP in the main buddy/rank UI. Bible cache/API diagnostics are removed from child screens. Detailed word progress is optional. |

## Verification

- **1,168 unit tests passed across 65 files.** The production build and TypeScript checks passed. The existing build-size advisory remains; this work does not introduce a deployment step.
- Unit checks cover reward approval, affordability rechecks, repeated approval/refund prevention, purchase undo, unsupported-item refunds, paused timers, all-world palette contrast, family PIN entry, modal focus and nested cleanup, independent sound controls, narration stop, assisted practice credit, saved quizzes, and starter vocabulary.
- The production build includes TypeScript validation.
- The local app was inspected at 390 × 844, including the compact lesson, immediate bookshelf, and story controls. The mobile lesson preview is saved with this chat.

The family PIN is a local device check, not a replacement for account authorization. Existing Firebase admin claims still control access to account administration. Speech quality, touch behavior on physical tablets, and usability with children still need real-device/user validation. External books remain unavailable until an editorial workflow can verify their text and suitability.
